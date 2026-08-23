export interface X402Challenge {
  chain: string;
  network: string;
  price: string;
  recipientWallet: string;
  protocol: string;
}

export interface AlgorandTransactionResult {
  txId: string;
  sender: string;
  amount: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export const ALGORAND_RECIPIENT = "GPKZWR5VVQFR7NATTDNZ53ZDFAK5LSW6T5K4ZWLIWIOYUTYPXDZWAEBUFA";

export async function requestX402AuditChallenge(): Promise<{ status: number; challenge?: X402Challenge; error?: string }> {
  try {
    const response = await fetch('/api/audit/x402', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'request_audit' })
    });

    if (response.status === 402) {
      const data = await response.json();
      return {
        status: 402,
        challenge: data.x402Challenge
      };
    }

    return { status: response.status };
  } catch (err: any) {
    return { status: 500, error: err.message };
  }
}

export async function submitAlgorandX402Payment(txId: string): Promise<any> {
  const response = await fetch('/api/audit/x402', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-402-Payment': txId,
      'X-402-Chain': 'Algorand'
    },
    body: JSON.stringify({ action: 'verify_and_scan' })
  });

  return await response.json();
}

export async function checkLatestAlgorandPayment(): Promise<string | null> {
  try {
    const res = await fetch(`https://testnet-idx.algonode.cloud/v2/accounts/${ALGORAND_RECIPIENT}/transactions?limit=3`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.transactions && data.transactions.length > 0) {
      const latestTx = data.transactions[0];
      return latestTx.id || null;
    }
  } catch (err) {
    console.warn("Algonode indexer query failed:", err);
  }
  return null;
}

export async function checkLatestAlgorandTransactionDetails(): Promise<{ txId: string; sender?: string } | null> {
  try {
    const res = await fetch(`https://testnet-idx.algonode.cloud/v2/accounts/${ALGORAND_RECIPIENT}/transactions?limit=3`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.transactions && data.transactions.length > 0) {
      const latestTx = data.transactions[0];
      return {
        txId: latestTx.id,
        sender: latestTx.sender || latestTx['payment-transaction']?.sender
      };
    }
  } catch (err) {
    console.warn("Algonode indexer query failed:", err);
  }
  return null;
}

export async function fetchLiveAlgorandAccountBalance(address: string): Promise<{ algo: number; usdc: number }> {
  try {
    const res = await fetch(`https://testnet-api.algonode.cloud/v2/accounts/${address}`);
    if (!res.ok) return { algo: 10.0, usdc: 5.0 };
    const data = await res.json();
    const microAlgos = data?.amount || 0;
    const algoBalance = microAlgos / 1000000;
    
    let usdcBalance = 0;
    if (data?.assets && Array.isArray(data.assets)) {
      const usdcAsset = data.assets.find((a: any) => a['asset-id'] === 10458941 || a['asset-id'] === 31566704);
      if (usdcAsset) {
        usdcBalance = (usdcAsset.amount || 0) / 100;
      }
    }
    return { algo: Number(algoBalance.toFixed(2)), usdc: Number(usdcBalance.toFixed(2)) };
  } catch (err) {
    console.warn("Failed to fetch live balance:", err);
    return { algo: 10.0, usdc: 5.0 };
  }
}

import algosdk from 'algosdk';

export async function sendRealAlgorandPayment(mnemonic: string): Promise<{ success: boolean; txId?: string; error?: string }> {
  try {
    const cleanMnemonic = mnemonic.trim();
    const account = algosdk.mnemonicToSecretKey(cleanMnemonic);
    const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud', 443);
    const params = await algodClient.getTransactionParams().do();
    
    // Create 0.5 ALGO Payment Transaction (500,000 microAlgos)
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: account.addr.toString(),
      to: ALGORAND_RECIPIENT,
      amount: 500000,
      note: new Uint8Array(Buffer.from("VibeShield x402 Security Audit Micropayment")),
      suggestedParams: params
    } as any);

    const signedTxn = txn.signTxn(account.sk);
    const sendResult = await algodClient.sendRawTransaction(signedTxn).do();
    const txId = (sendResult as any).txid || (sendResult as any).txId || "";
    
    // Wait for on-chain confirmation
    await algosdk.waitForConfirmation(algodClient, txId, 4);
    return { success: true, txId };
  } catch (err: any) {
    console.error("Real Algorand payment failed:", err);
    return { success: false, error: err?.message || "Invalid 25-word mnemonic or insufficient ALGO balance." };
  }
}

export async function executeAgentAutoPayment(): Promise<{ success: boolean; txId?: string; error?: string }> {
  try {
    const response = await fetch('/api/audit/x402', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'agent_auto_pay' })
    });
    const data = await response.json();
    return { success: true, txId: data.txId };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
