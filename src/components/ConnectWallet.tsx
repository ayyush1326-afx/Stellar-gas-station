import React, { useState } from 'react';
// Mocked StellarWalletsKit for demo mode
import { Plug, PowerOff, Loader2, AlertCircle } from 'lucide-react';

interface ConnectWalletProps {
  onConnect?: (address: string, signer: (xdr: string) => Promise<string>) => void;
  onDisconnect?: () => void;
}

// kit initialization removed for demo mode

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect, onDisconnect }) => {
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const connect = async () => {
    setIsConnecting(true);
    setErrorMessage(null);
    try {
      // Mock openModal behavior
      setTimeout(() => {
        const pk = 'GA7YQQVCHDXK3O7QZ6HXTFX6N66WXZ2FXQ6M2XGZQ3PZXXHXVY4X2VXY'; // Mock address
        const signer = async (xdr: string): Promise<string> => {
          // Dummy signer for demo
          return xdr; 
        };
        setAddress(pk);
        onConnect?.(pk, signer);
      }, 1000);
    } catch (e: any) {
      console.error(e);
      setErrorMessage("SYSTEM_ERROR: Failed to initialize wallet modal.");
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
      {errorMessage && (
        <div className="absolute top-20 right-4 bg-red-900/90 border border-red-500 text-red-100 px-4 py-3 rounded shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={20} />
          <span className="text-xs font-mono">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-2 hover:text-white">×</button>
        </div>
      )}

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
