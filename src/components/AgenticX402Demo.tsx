"use client";

import React, { useState } from 'react';
import { requestX402AuditChallenge, submitAlgorandX402Payment, ALGORAND_RECIPIENT } from '../utils/algorandX402';

export function AgenticX402Demo() {
  const [step, setStep] = useState<number>(1);
  const [challengeData, setChallengeData] = useState<any>(null);
  const [paymentTx, setPaymentTx] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleStep1RequestAudit = async () => {
    setLoading(true);
    const result = await requestX402AuditChallenge();
    setLoading(false);

    if (result.status === 402 && result.challenge) {
      setChallengeData(result.challenge);
      setStep(2);
    }
  };

  const handleStep2SimulateAgentPayment = async () => {
    setLoading(true);
    // Simulate AI Agent signing 0.5 ALGO transaction on Algorand blockchain
    const mockAlgoTxId = `tx_algo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setPaymentTx(mockAlgoTxId);

    setTimeout(async () => {
      const res = await submitAlgorandX402Payment(mockAlgoTxId);
      setLoading(false);
      if (res.success) {
        setAuditResult(res);
        setStep(3);
      }
    }, 1200);
  };

  const handleResetDemo = () => {
    setStep(1);
    setChallengeData(null);
    setPaymentTx(null);
    setAuditResult(null);
  };

  return (
    <div className="w-full p-6 sm:p-8 rounded-3xl bg-[#09090b] border-2 border-purple-500/40 text-white font-inter space-y-6 shadow-2xl">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-pulse">🤖</span>
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider text-white">
              Agentic Commerce Demo (x402 Protocol + Algorand)
            </h3>
            <p className="text-xs text-purple-300 font-mono">
              AI Agents buying code security audits automatically via Algorand micro-transactions
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-500/50 text-[10px] font-black uppercase tracking-widest">
          x402 Enabled
        </span>
      </div>

      {/* Step Progress */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold uppercase tracking-wider">
        <div className={`p-3 rounded-xl border ${step >= 1 ? 'bg-[#5E0ED7] border-purple-400 text-white' : 'bg-black/50 border-white/10 text-zinc-500'}`}>
          1. API Query (HTTP 402)
        </div>
        <div className={`p-3 rounded-xl border ${step >= 2 ? 'bg-[#5E0ED7] border-purple-400 text-white' : 'bg-black/50 border-white/10 text-zinc-500'}`}>
          2. Algorand Micro-Pay
        </div>
        <div className={`p-3 rounded-xl border ${step >= 3 ? 'bg-[#00FF9D] border-emerald-400 text-black font-black' : 'bg-black/50 border-white/10 text-zinc-500'}`}>
          3. Audit Unlocked
        </div>
      </div>

      {/* Step 1 Content */}
      {step === 1 && (
        <div className="p-5 rounded-2xl bg-black border border-white/10 space-y-4 text-center">
          <p className="text-xs text-zinc-300 normal-case">
            An autonomous AI coding agent calls <code>POST /api/audit/x402</code> to inspect a codebase repository for security flaws.
          </p>
          <button
            onClick={handleStep1RequestAudit}
            disabled={loading}
            className="px-6 py-3 rounded-full bg-[#5E0ED7] hover:bg-[#6e14fa] text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer"
          >
            {loading ? 'Sending Request...' : '🤖 AI Agent: Request Security Audit'}
          </button>
        </div>
      )}

      {/* Step 2 Content */}
      {step === 2 && challengeData && (
        <div className="p-5 rounded-2xl bg-black border border-amber-500/50 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-400">
            <span>⚠️ HTTP 402 PAYMENT REQUIRED CHALLENGE</span>
            <span>CHAIN: ALGORAND</span>
          </div>

          <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono space-y-4 text-amber-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="p-3 bg-white rounded-2xl border-2 border-amber-400 shadow-2xl shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=algorand://${ALGORAND_RECIPIENT}?amount=500000`}
                  alt="Algorand Payment QR Code"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <div className="space-y-2 text-left">
                <div className="text-sm font-black text-amber-400">📱 SCAN WITH PERA WALLET</div>
                <div>• Price: <strong className="text-white text-sm">{challengeData.price}</strong></div>
                <div>• Chain: <strong className="text-white">Algorand Testnet</strong></div>
                <div>• Recipient Wallet: <strong className="text-white truncate block max-w-xs font-mono">{ALGORAND_RECIPIENT}</strong></div>
                <div className="text-xs text-amber-300 font-sans leading-relaxed pt-1">
                  Scanning this QR code with Pera Wallet pre-fills <strong>0.5 ALGO</strong> payment automatically!
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleStep2SimulateAgentPayment}
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#00FF9D] hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer"
          >
            {loading ? 'Settling Transaction on Algorand...' : '⚡ AI Agent: Pay 0.5 ALGO on Algorand & Unlock Audit'}
          </button>
        </div>
      )}

      {/* Step 3 Content */}
      {step === 3 && auditResult && (
        <div className="p-5 rounded-2xl bg-black border border-emerald-500/50 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
            <span>✓ ALGORAND x402 PAYMENT VERIFIED</span>
            <span>TX: {paymentTx}</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono space-y-2 text-emerald-200">
            <div className="font-bold text-white uppercase text-sm">Audit Report Unlocked Successfully!</div>
            <div>• Health Score: <strong>{auditResult.auditReport.score} / 100 (Grade {auditResult.auditReport.grade})</strong></div>
            <div>• Critical Flaws Found: <strong>{auditResult.auditReport.vulnerabilities.length} Issues</strong></div>
          </div>

          <button
            onClick={handleResetDemo}
            className="px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
          >
            🔄 Run Another Agentic Demo
          </button>
        </div>
      )}
    </div>
  );
}
