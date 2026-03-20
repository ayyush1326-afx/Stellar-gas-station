import { useState, useCallback, useEffect, useRef } from 'react';
import { Horizon, rpc, TransactionBuilder, Networks, BASE_FEE, xdr, Contract, nativeToScVal } from 'stellar-sdk';
import { CONTRACT_ID, RPC_URL, NETWORK_PASSPHRASE } from '../utils/contractConfig';

const TESTNET_URL = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(TESTNET_URL);
const rpcServer = new rpc.Server(RPC_URL);

export interface RefuelEvent {
  id: string;
  user: string;
  amount: number;
  ledger: number;
  timestamp: number;
}

interface DepositResult {
  hash: string;
}

export const useStellar = (address: string, signTx?: (xdr: string) => Promise<string>) => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isRefueling, setIsRefueling] = useState(false);
  const [fuelBalance, setFuelBalance] = useState<number>(0);
  const [refuelEvents, setRefuelEvents] = useState<RefuelEvent[]>([]);
  const lastLedgerRef = useRef<number>(0);

  const fetchBalance = useCallback(async () => {
    if (!address) return;
    setIsLoadingBalance(true);
    try {
      const account = await server.loadAccount(address);
      const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
      if (nativeBalance) {
        setBalance(parseFloat(nativeBalance.balance));
      }
    } catch (e) {
      console.error('Failed to load account:', e);
      setBalance(0);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [address]);

  const fetchFuelBalance = useCallback(async () => {
    if (!address || CONTRACT_ID === 'PLACEHOLDER_CONTRACT_ID') return;
    try {
      const contract = new Contract(CONTRACT_ID);
      const account = await rpcServer.getAccount(address);
      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('get_fuel', nativeToScVal(address, { type: 'address' })))
        .setTimeout(30)
        .build();
      const result = await rpcServer.simulateTransaction(tx);
      if (rpc.Api.isSimulationSuccess(result) && result.result) {
        const val = xdr.ScVal.fromXDR(result.result.retval.toXDR());
        setFuelBalance(Number(val.i128().lo()));
      }
    } catch (e) {
      console.error('Failed to fetch fuel balance:', e);
    }
  }, [address]);

  const fetchRefuelEvents = useCallback(async () => {
    if (CONTRACT_ID === 'PLACEHOLDER_CONTRACT_ID') return;
    try {
      const latestLedger = await rpcServer.getLatestLedger();
      const startLedger = Math.max(1, latestLedger.sequence - 2000);
      const response = await rpcServer.getEvents({
        startLedger,
        filters: [
          {
            type: 'contract',
            contractIds: [CONTRACT_ID],
            topics: [['*', '*']],
          },
        ],
        limit: 50,
      });
      if (response.events && response.events.length > 0) {
        const events: RefuelEvent[] = response.events
          .filter(e => e.topic && e.topic.length >= 2)
          .map(e => ({
            id: e.id,
            user: e.topic[1]?.address?.accountId() || 'unknown',
            amount: Number(e.value?.i128?.().lo?.() || 0),
            ledger: e.ledger,
            timestamp: Date.now(),
          }));
        setRefuelEvents(events.reverse());
        if (response.events.length > 0) {
          lastLedgerRef.current = response.events[response.events.length - 1].ledger;
        }
      }
    } catch (e) {
      console.error('Failed to fetch events:', e);
    }
  }, []);

  const deposit = useCallback(async (amount: number): Promise<DepositResult> => {
    if (!address || !signTx || CONTRACT_ID === 'PLACEHOLDER_CONTRACT_ID') {
      throw new Error('Wallet not connected or contract not deployed yet.');
    }
    try {
      const contract = new Contract(CONTRACT_ID);
      const account = await rpcServer.getAccount(address);
      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            'deposit',
            nativeToScVal(address, { type: 'address' }),
            nativeToScVal(amount, { type: 'i128' })
          )
        )
        .setTimeout(30)
        .build();

      const simResult = await rpcServer.simulateTransaction(tx);
      if (!rpc.Api.isSimulationSuccess(simResult)) {
        throw new Error('Simulation failed: ' + JSON.stringify(simResult));
      }
      const preparedTx = rpc.assembleTransaction(tx, simResult).build();
      const signedXdr = await signTx(preparedTx.toXDR());
      const submittedTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
      const sendResult = await rpcServer.sendTransaction(submittedTx);
      if (sendResult.status === 'ERROR') {
        throw new Error('Send failed');
      }
      const hash = sendResult.hash;
      let attempts = 0;
      while (attempts < 30) {
        await new Promise(r => setTimeout(r, 2000));
        const status = await rpcServer.getTransaction(hash);
        if (status.status === rpc.Api.GetTransactionStatus.SUCCESS) {
          await fetchFuelBalance();
          await fetchRefuelEvents();
          return { hash };
        }
        if (status.status === rpc.Api.GetTransactionStatus.FAILED) {
          throw new Error('Transaction failed on-chain');
        }
        attempts++;
      }
      throw new Error('Transaction confirmation timed out');
    } catch (e: unknown) {
      const err = e as Error;
      if (err?.message?.includes('insufficient') || err?.message?.includes('balance')) {
        throw new Error('INSUFFICIENT_BALANCE: Not enough XLM for this transaction.');
      }
      if (err?.message?.includes('reject') || err?.message?.includes('cancel')) {
        throw new Error('USER_REJECTED: Transaction was cancelled.');
      }
      throw e;
    }
  }, [address, signTx, fetchFuelBalance, fetchRefuelEvents]);

  const refuel = async () => {
    if (!address) return false;
    setIsRefueling(true);
    try {
      const response = await fetch(`https://friendbot.stellar.org/?addr=${encodeURIComponent(address)}`);
      if (response.ok) {
        await fetchBalance();
        return true;
      } else {
        console.error('Friendbot failed:', await response.text());
        return false;
      }
    } catch (e) {
      console.error('Refuel error:', e);
      return false;
    } finally {
      setIsRefueling(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchBalance();
      fetchFuelBalance();
      fetchRefuelEvents();
    } else {
      setBalance(0);
      setFuelBalance(0);
    }
  }, [address, fetchBalance, fetchFuelBalance, fetchRefuelEvents]);

  // Poll for new events every 10s
  useEffect(() => {
    if (!address || CONTRACT_ID === 'PLACEHOLDER_CONTRACT_ID') return;
    const interval = setInterval(fetchRefuelEvents, 10000);
    return () => clearInterval(interval);
  }, [address, fetchRefuelEvents]);

  return {
    balance,
    fetchBalance,
    isLoadingBalance,
    refuel,
    isRefueling,
    fuelBalance,
    fetchFuelBalance,
    deposit,
    refuelEvents,
  };
};
