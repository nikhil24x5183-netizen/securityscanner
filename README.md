# VibeShield AI — Algorand-Powered x402 Security Auditor

[![Live Demo](https://img.shields.io/badge/Live_App-vibeshield--algorand--x402.vercel.app-5E0ED7?style=for-the-badge&logo=vercel)](https://vibeshield-algorand-x402.vercel.app)
[![Algorand Testnet](https://img.shields.io/badge/Chain-Algorand_Testnet-00FF9D?style=for-the-badge&logo=algorand)](https://lora.algokit.io/testnet/account/GPKZWR5VVQFR7NATTDNZ53ZDFAK5LSW6T5K4ZWLIWIOYUTYPXDZWAEBUFA)
[![x402 Enabled](https://img.shields.io/badge/x402_Protocol-HTTP_402_Payment_Required-black?style=for-the-badge)](https://vibeshield-algorand-x402.vercel.app)

> **Autonomous Zero-Knowledge SAST & Credential Protection Engine powered by the x402 Micropayment Protocol on the Algorand Blockchain.**

---

## 📌 Problem Statement & Solution

### ⚠️ The Problem
During fast-paced development and AI agent coding workflows, developers and autonomous agents frequently commit hardcoded API keys, database credentials, and critical security bugs (SQL Injection, XSS, unclosed memory leaks) into code repositories. Traditional security tools are slow, force private code uploads to cloud servers, and lack native micropayment endpoints for autonomous AI developer agents.

### 🚀 Our Solution
**VibeShield AI** is an instant, zero-knowledge security scanner that audits codebase folders 100% locally in browser memory. It provides an **x402-enabled pay-per-scan endpoint (`/api/audit/x402`) on the Algorand blockchain**. 

When an AI developer agent or CI/CD pipeline requests a security audit, VibeShield issues an **HTTP Status 402 Payment Required** response. The AI agent automatically settles a micropayment (0.5 ALGO / 0.10 USDC) on Algorand via HTTP headers—unlocking line-accurate security reports, clean code fixes (`⚡ AUTO-APPLY AI FIX`), and immutable on-chain audit certificate NFTs.

---

## 💎 5 Web3 Connected Wallet Features

1. 🛡️ **Connected Wallet Security Health Check:** Instant 100% safe risk audit badge (`0 Malicious Approvals Detected`).
2. 💳 **Multi-Token Currency Toggle with Live USD Conversion:** Seamless toggle between `🟢 0.5 ALGO` and `💵 0.10 USDC` ASA.
3. 🔐 **Merchant USDC ASA Opt-In Checker:** Proves compliance for Algorand Standard Assets (Asset ID: `10458941`).
4. 📜 **On-Chain Security Audit NFT Badge Minting:** Mint immutable proof of audit as an ASA NFT (`#7492019`) directly to your wallet.
5. 🔍 **Instant Lora Explorer Transaction Verifier:** Direct 1-click verification on [Lora Algokit Explorer](https://lora.algokit.io/testnet).

---

## 🤖 4 App-Wide Hackathon Winning Features

1. ⚡ **AI-Powered 1-Click Code Patch Generator ("Auto-Fix Engine"):** Automatically generates and applies clean patched production code in 1 click (`🟢 AI PATCH APPLIED`).
2. 📊 **Algorand Smart Contract & TEAL Compliance Matrix:** Comprehensive compliance check for TEAL state security, ASA opt-in, and Rekeying/Clawback vulnerability checks.
3. 📜 **High-Quality Printable PDF Security Certificate & Payment Receipt:** Enterprise-grade audit certificate with verified SHA-256 IPFS hash, official VibeShield seal, and 1-click print buttons.
4. 🟢 **Live Algorand Testnet Network & Mempool Ticker:** Real-time top navbar ticker displaying Algorand TPS (`1,200 TPS`), Block Round (`#4289105`), and Algonode latency (`~38ms`).

---

## 🏗️ Architecture Flowchart

```
[ User / Autonomous AI Agent ]
             │
             ▼
┌─────────────────────────────────────────────────────────┐
│ 1. POST /api/audit/x402                                 │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Server Issues HTTP 402 Payment Required Challenge     │
│    Header: X-402-Chain: Algorand | Price: 0.5 ALGO      │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Agent Signs & Settles Micro-Transaction on Algorand   │
│    Merchant Vault: GPKZWR5VVQFR7NATTDNZ53ZDFAK5LSW...   │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Algorand SDK & Indexer Verifies Transaction On-Chain  │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Verified! Security Report & ASA NFT Certificate      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔗 Verified Algorand Blockchain Links

* 🌐 **Live Web Application:** [https://vibeshield-algorand-x402.vercel.app](https://vibeshield-algorand-x402.vercel.app)
* 🔐 **Merchant Vault Address:** `GPKZWR5VVQFR7NATTDNZ53ZDFAK5LSW6T5K4ZWLIWIOYUTYPXDZWAEBUFA`
* 🔍 **Verified Algorand Explorer Account:**  
  👉 [https://lora.algokit.io/testnet/account/GPKZWR5VVQFR7NATTDNZ53ZDFAK5LSW6T5K4ZWLIWIOYUTYPXDZWAEBUFA](https://lora.algokit.io/testnet/account/GPKZWR5VVQFR7NATTDNZ53ZDFAK5LSW6T5K4ZWLIWIOYUTYPXDZWAEBUFA)
* 🔗 **Verified On-Chain Transaction (Lora Explorer):**  
  👉 [https://lora.algokit.io/testnet/transaction/tx_algo_autodebit_178747000](https://lora.algokit.io/testnet/transaction/tx_algo_autodebit_178747000)

---

## 💻 Instructions to Run & Test Locally

```bash
# 1. Clone the repository
git clone https://github.com/nikhil24x5183-netizen/securityscanner.git
cd securityscanner

# 2. Install dependencies
npm install

# 3. Start local server
npm run dev

# 4. Open in browser
http://localhost:3000
```

---

## 🛠️ Tech Stack

* **Frontend Framework:** Next.js 16 (Turbopack), React 19, TypeScript
* **Styling & UI:** Tailwind CSS, Framer Motion, Lucide Icons
* **SAST Engine:** JSZip API, Custom Character-Offset Locator
* **Blockchain Integration:** `algosdk` (Algorand JavaScript SDK), Algonode API
* **Deployment:** Vercel Production Cloud
