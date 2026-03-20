import React from 'react';
import { Loader2 } from 'lucide-react';

interface RefuelActionProps {
  onRefuel: () => Promise<boolean>;
  isRefueling: boolean;
}

export const RefuelAction: React.FC<RefuelActionProps> = ({ onRefuel, isRefueling }) => {
  return (
    <div className="border border-gray-800 p-4 rounded bg-black/40 flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-400 mb-4 tracking-wider">ACTION: REFUEL</h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Request Testnet XLM from the Stellar Friendbot to recharge the connected wallet.
        </p>
      </div>
      <button 
        onClick={onRefuel}
        disabled={isRefueling}
        className="mt-auto w-full flex justify-center items-center gap-2 bg-blue-900/30 border border-blue-500 text-blue-400 py-2 rounded uppercase text-sm font-bold hover:bg-blue-800/40 disabled:opacity-50 transition-colors"
      >
        {isRefueling ? <Loader2 size={16} className="animate-spin" /> : null}
        {isRefueling ? 'REFUELING...' : 'EXECUTE AUTO-REFUEL'}
      </button>
    </div>
  );
};
