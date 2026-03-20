import React, { useState } from 'react';
import { Zap, Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { EXPERT_BASE_URL } from '../utils/contractConfig';

type TxStatus = 'idle' | 'processing' | 'success' | 'error';

interface DepositFuelProps {
  onDeposit: (amount: number) => Promise<{ hash: string } | null>;
  fuelBalance: number;
}

export const DepositFuel: React.FC<DepositFuelProps> = ({ onDeposit, fuelBalance }) => {
  const [amount, setAmount] = useState<string>('100');
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDeposit = async () => {
    const amt = parseInt(amount);
    if (!amt || amt <= 0) return;
    setTxStatus('processing');
    setTxHash(null);
    setErrorMsg(null);
    try {
      const result = await onDeposit(amt);
      if (result?.hash) {
        setTxHash(result.hash);
        setTxStatus('success');
      } else {
        throw new Error('No transaction hash returned');
      }
    } catch (e: any) {
      console.error('Deposit failed:', e);
      setErrorMsg(e?.message || 'Transaction failed');
      setTxStatus('error');
    }
  };

  const reset = () => {
    setTxStatus('idle');
    setTxHash(null);
    setErrorMsg(null);
  };

  return (
    <div className="border border-green-900/60 p-4 rounded bg-black/40 flex flex-col h-full gap-4">
      <div>
        <h3 className="text-sm font-bold text-green-400 mb-1 tracking-wider flex items-center gap-2">
          <Zap size={14} /> DEPOSIT_FUEL_TO_STATION
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Deposit fuel units into the on-chain Gas Station contract.
          Current reserve: <span className="text-green-400 font-bold">{fuelBalance} units</span>
        </p>
      </div>

      {/* Amount Input */}
      {txStatus === 'idle' && (
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-400 tracking-wider">FUEL_AMOUNT (units)</label>
          <div className="flex gap-2">
            {[50, 100, 500].map(v => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className={`text-xs px-3 py-1 rounded border transition-colors ${
                  amount === String(v)
                    ? 'bg-green-900/60 border-green-500 text-green-300'
                    : 'bg-black/40 border-gray-700 text-gray-500 hover:border-green-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-gray-950 border border-gray-700 text-green-400 px-3 py-2 rounded text-sm font-mono focus:border-green-500 focus:outline-none"
            min="1"
          />
        </div>
      )}

      {/* Status Display */}
      {txStatus === 'processing' && (
        <div className="flex flex-col items-center justify-center py-4 gap-3 text-center">
          <Loader2 size={28} className="animate-spin text-yellow-400" />
          <p className="text-yellow-400 text-xs tracking-widest animate-pulse">PROCESSING_TX...</p>
          <p className="text-gray-600 text-xs">Waiting for blockchain confirmation</p>
        </div>
      )}

      {txStatus === 'success' && (
        <div className="flex flex-col items-center justify-center py-3 gap-3 text-center">
          <CheckCircle2 size={28} className="text-green-400" />
          <p className="text-green-400 text-xs tracking-widest font-bold">TX_CONFIRMED</p>
          {txHash && (
            <a
              href={`${EXPERT_BASE_URL}/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 break-all transition-colors"
            >
              {txHash.slice(0, 16)}...{txHash.slice(-8)}
              <ExternalLink size={10} />
            </a>
          )}
          <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-400 transition-colors mt-1">
            [ NEW_DEPOSIT ]
          </button>
        </div>
      )}

      {txStatus === 'error' && (
        <div className="flex flex-col items-center justify-center py-3 gap-2 text-center">
          <XCircle size={28} className="text-red-400" />
          <p className="text-red-400 text-xs tracking-widest font-bold">TX_FAILED</p>
          <p className="text-gray-500 text-xs break-all">{errorMsg}</p>
          <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-300 transition-colors mt-1">
            [ RETRY ]
          </button>
        </div>
      )}

      {/* Deposit Button */}
      {txStatus === 'idle' && (
        <button
          onClick={handleDeposit}
          className="mt-auto w-full flex justify-center items-center gap-2 bg-green-900/40 border border-green-500 text-green-400 py-2 rounded uppercase text-sm font-bold hover:bg-green-800/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all"
        >
          <Zap size={14} />
          EXECUTE_DEPOSIT
        </button>
      )}
    </div>
  );
};
