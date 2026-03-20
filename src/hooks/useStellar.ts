import { useState, useCallback, useEffect } from 'react';
import { Horizon } from 'stellar-sdk';

const TESTNET_URL = 'https://horizon-testnet.stellar.org';
const server = new Horizon.Server(TESTNET_URL);

export const useStellar = (address: string) => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isRefueling, setIsRefueling] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!address) return;
    setIsLoadingBalance(true);
    try {
      const account = await server.loadAccount(address);
      // @ts-ignore - Horizon types can be tricky
      const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
      if (nativeBalance) {
        setBalance(parseFloat(nativeBalance.balance));
      }
    } catch (e) {
      console.error("Failed to load account, it might not exist yet on the network.", e);
      setBalance(0);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchBalance();
    } else {
      setBalance(0);
    }
  }, [address, fetchBalance]);

  const refuel = async () => {
    if (!address) return false;
    setIsRefueling(true);
    try {
      const response = await fetch(`https://friendbot.stellar.org/?addr=${encodeURIComponent(address)}`);
      if (response.ok) {
        await fetchBalance();
        return true;
      } else {
        console.error("Friendbot failed:", await response.text());
        return false;
      }
    } catch (e) {
      console.error("Refuel error:", e);
      return false;
    } finally {
      setIsRefueling(false);
    }
  };

  return { balance, fetchBalance, isLoadingBalance, refuel, isRefueling };
};
