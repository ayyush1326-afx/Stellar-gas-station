import { useState } from 'react';
import { ConnectWallet } from './components/ConnectWallet';
import { FuelGauge } from './components/FuelGauge';
import { RefuelAction } from './components/RefuelAction';
import { TransferAction } from './components/TransferAction';
import { useStellar } from './hooks/useStellar';
import { Terminal, RefreshCw } from 'lucide-react';

function App() {
  const [address, setAddress] = useState<string>('');
  const { balance, fetchBalance, isLoadingBalance, refuel, isRefueling } = useStellar(address);

  return (
    <div className="min-h-screen bg-[#0D1117] text-green-500 font-mono p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-green-900/50 pb-6">
          <div className="flex items-center gap-3">
            <Terminal size={32} className="text-green-400" />
            <div>
              <h1 className="text-2xl font-bold tracking-widest text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                STELLAR_GAS_STATION
              </h1>
              <p className="text-xs text-green-700 uppercase tracking-widest mt-1">
                TESTNET :: REFUEL DASHBOARD
              </p>
            </div>
          </div>
          <ConnectWallet 
            onConnect={(addr) => setAddress(addr)}
            onDisconnect={() => setAddress('')} 
          />
        </header>

        {/* Main Content */}
        <main className="flex flex-col gap-8 mt-4 items-center w-full">
          {address ? (
            <div className="w-full bg-gray-950 border border-green-900 p-8 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <h2 className="text-xl font-bold mb-6 text-green-400 border-b border-green-900/30 pb-2">
                SYSTEM_STATUS
              </h2>
              
              <div className="flex flex-col items-center mb-8 relative">
                <button 
                  onClick={fetchBalance}
                  disabled={isLoadingBalance}
                  className="absolute right-0 top-0 text-gray-500 hover:text-green-400 transition-colors p-2"
                  title="Refresh Balance"
                >
                  <RefreshCw size={16} className={isLoadingBalance ? "animate-spin" : ""} />
                </button>
                <FuelGauge balance={balance} maxCapacity={10000} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <RefuelAction onRefuel={refuel} isRefueling={isRefueling} />
                <TransferAction senderAddress={address} onSuccess={fetchBalance} />
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-green-900/30 rounded-lg w-full">
              <div className="text-green-800 mb-4">
                <Terminal size={48} />
              </div>
              <h2 className="text-xl tracking-widest text-green-600 mb-2">SYSTEM OFFLINE</h2>
              <p className="text-green-800 text-sm max-w-md">
                Please initialize connection using Freighter wallet to access the refuel console and manage Testnet XLM.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
