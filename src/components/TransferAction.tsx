import React, { useState } from 'react';
import { sendStellarTransaction } from '../utils/stellarTx';
import { Loader2, Send, CheckCircle, ExternalLink, AlertCircle } from 'lucide-react';

interface TransferActionProps {
  senderAddress: string;
  onSuccess: () => void;
}

export const TransferAction: React.FC<TransferActionProps> = ({ senderAddress, onSuccess }) => {
  const [recipient, setRecipient] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      setError("Please enter a recipient address.");
      return;
    }
    setError(null);
    setTxHash(null);
    setIsSending(true);

    try {
      const response = await sendStellarTransaction(senderAddress, recipient, '100');
      // @ts-ignore
      setTxHash(response.hash || response.id);
      onSuccess();
      setRecipient('');
    } catch (err: any) {
      setError(err?.message || "Transaction failed. Please check the address and try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="border border-gray-800 p-4 rounded bg-black/40 flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-400 mb-4 tracking-wider">ACTION: TRANSFER</h3>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Send a fixed amount of 100 XLM to a target address on the Stellar Testnet.
        </p>
        
        <form onSubmit={handleSend} className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Recipient G-Address" 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isSending}
            className="w-full bg-gray-900 border border-purple-900/50 text-green-400 placeholder:text-gray-600 text-xs px-3 py-2 rounded focus:outline-none focus:border-purple-500"
          />

          {error && (
            <div className="flex items-start gap-2 text-red-400 text-xs bg-red-950/30 p-2 rounded border border-red-900/50">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {txHash && (
            <div className="flex flex-col gap-2 text-green-400 text-xs bg-green-950/30 p-2 rounded border border-green-900/50">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="shrink-0" />
                <span className="font-bold">TRANSFER SUCCESSFUL</span>
              </div>
              <a 
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline break-all"
              >
                <span>View on Stellar.expert</span>
                <ExternalLink size={12} className="shrink-0" />
              </a>
            </div>
          )}

          <button 
            type="submit"
            disabled={isSending || !recipient}
            className="mt-2 w-full flex justify-center items-center gap-2 bg-purple-900/30 border border-purple-500 text-purple-400 py-2 rounded uppercase text-sm font-bold hover:bg-purple-800/40 disabled:opacity-50 transition-colors"
          >
            {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {isSending ? 'PROCESSING...' : 'SEND 100 XLM'}
          </button>
        </form>
      </div>
    </div>
  );
};
