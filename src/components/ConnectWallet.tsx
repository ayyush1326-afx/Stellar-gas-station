import React, { useState } from 'react';
import { requestAccess } from '@stellar/freighter-api';
import { Plug, PowerOff, Loader2 } from 'lucide-react';

interface ConnectWalletProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect, onDisconnect }) => {
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const { address: pk, error } = await requestAccess();
      if (pk) {
        setAddress(pk);
        onConnect?.(pk);
      } else {
        alert("Freighter access denied. " + (error || ""));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect Freighter wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress('');
    onDisconnect?.();
  };

  return (
    <div className="flex items-center">
      {address ? (
        <div className="flex items-center gap-4 bg-gray-900 border border-green-800 px-4 py-2 rounded-md font-mono text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500 text-xs">CONNECTED_SYSTEM</span>
            <span className="text-green-400 font-bold">
              {address.slice(0, 5)}...{address.slice(-4)}
            </span>
          </div>
          <button 
            onClick={disconnect}
            className="p-2 hover:bg-red-900/40 text-red-500 border border-transparent hover:border-red-500 rounded-md transition-colors"
            title="Disconnect"
          >
            <PowerOff size={16} />
          </button>
        </div>
      ) : (
        <button 
          onClick={connect}
          disabled={isConnecting}
          className="flex items-center gap-2 bg-green-900/30 border border-green-500 hover:bg-green-500/20 text-green-400 font-bold px-6 py-3 rounded-md disabled:opacity-50 transition-colors font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
        >
          {isConnecting ? <Loader2 size={18} className="animate-spin" /> : <Plug size={18} />}
          {isConnecting ? 'CONNECTING...' : 'INIT_CONNECTION'}
        </button>
      )}
    </div>
  );
};
