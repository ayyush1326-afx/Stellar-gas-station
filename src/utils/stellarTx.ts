import { TransactionBuilder, Networks, Asset, Operation, Horizon } from 'stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

const server = new Horizon.Server('https://horizon-testnet.stellar.org');

export async function sendStellarTransaction(senderAddress: string, destinationAddress: string, amount: string) {
  try {
    // 1. Load sender account
    const sourceAccount = await server.loadAccount(senderAddress);

    // 2. Build Transaction
    const tx = new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: Networks.TESTNET,
    })
    .addOperation(Operation.payment({
      destination: destinationAddress,
      asset: Asset.native(),
      amount: amount,
    }))
    .setTimeout(60) // 60 seconds timeout
    .build();

    // 3. Sign with Freighter
    const signedTxResponse = await signTransaction(tx.toXDR(), {
      networkPassphrase: Networks.TESTNET
    });
    
    // In newer versions of Freighter API, the response returns signedTxXdr inside an object
    const signedTxXdr = (signedTxResponse as any).signedTxXdr || (signedTxResponse as any).signedTx || (typeof signedTxResponse === 'string' ? signedTxResponse : null);
    
    if (!signedTxXdr) {
       throw new Error("Failed to get signed transaction string from Freighter");
    }

    // 4. Submit to Horizon
    // Provide the cast as any or standard Transaction
    const transactionToSubmit = TransactionBuilder.fromXDR(signedTxXdr, Networks.TESTNET);
    
    const response = await server.submitTransaction(transactionToSubmit as any);
    return response;
  } catch (error) {
    console.error("Transaction failed", error);
    throw error;
  }
}
