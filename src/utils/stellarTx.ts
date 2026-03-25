// Mocked for demo mode

export async function sendStellarTransaction(_senderAddress: string, _destinationAddress: string, _amount: string) {
  try {
    // Mocking transaction for demo mode
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { hash: "mock_transfer_hash_" + Date.now() };
  } catch (error) {
    console.error("Transaction failed", error);
    throw error;
  }
}
