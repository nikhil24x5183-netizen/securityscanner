# VibeShield AI — Algorand-Powered x402 Security Auditor

[![Live Demo](https://img.shields.io/badge/Live_App-vibeshield--algorand--x402.vercel.app-5E0ED7?style=for-the-badge&logo=vercel)](https://vibeshield-algorand-x402.vercel.app)
[![Algorand Testnet](https://img.shields.io/badge/Chain-Algorand_Testnet-00FF9D?style=for-the-badge&logo=algorand)](https://lora.algokit.io/testnet)
[![x402 Enabled](https://img.shields.io/badge/x402_Protocol-HTTP_402_Payment_Required-black?style=for-the-badge)](https://vibeshield-algorand-x402.vercel.app)

> **Autonomous Zero-Knowledge SAST & Credential Protection Engine powered by the x402 Micropayment Protocol on the Algorand Blockchain.**

---

## 📌 Problem Statement & Solution

### ⚠️ The Problem
During fast-paced development and AI agent coding workflows, developers and autonomous agents frequently commit hardcoded API keys, database credentials, and critical security bugs (SQL Injection, XSS, unclosed memory leaks) into code repositories. Traditional security tools are slow, force private code uploads to cloud servers, and lack native micropayment endpoints for autonomous AI developer agents.

### 🚀 Our Solution
**VibeShield AI** is an instant, zero-knowledge security scanner that audits codebase folders 100% locally in browser memory. It provides an **x402-enabled pay-per-scan endpoint (`/api/audit/x402`) on the Algorand blockchain**. 

When an AI developer agent or CI/CD pipeline requests a security audit, VibeShield issues an **HTTP Status 402 Payment Required** response. The AI agent automatically settles a micropayment (0.5 ALGO) on Algorand via HTTP headers—unlocking line-accurate security reports and instant copy-paste remediation code (`📋 COPY SAFE FIX`).

---

## 💎 Unique Selling Proposition (USP)

1. **100% Zero-Knowledge In-Browser Privacy:** Audits codebase directories locally in browser RAM using `JSZip`. Private source code never leaves the user's computer.
2. **Exact Character-Offset Line Locator:** Calculates raw character string index offsets (`match.index`) to pinpoint precise file paths and line numbers without line-guessing.
3. **x402 Agentic Commerce on Algorand:** Enables autonomous AI coding agents to buy security reports on-chain without human approval or credit card setups.
4. **Automated Clean Code Patching (`📋 COPY SAFE FIX`):** Generates ready-to-use secure code replacement blocks for instant remediation.
5. **Strict Penalty Scoring Engine:** Applies deterministic risk penalties (Start 100; Critical -20 pts) to eliminate fake "100% Safe" ratings on dangerous codebases.

---

## 🏗️ Architecture Diagram

```
[ User / AI Developer Agent ]
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
│    Recipient: GPKZWR5VVQFR7NATTDNZ53ZDFAK5LSW6T5K4ZW... │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Algorand Indexer API (algosdk) Verifies On-Chain     │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Verified! Security Audit Unlocked (Line-Level Fixes) │
└─────────────────────────────────────────────────────────┘
```

---

## 🔗 Live Algorand Testnet Transaction & Verification

* **Live Web Application:** [https://vibeshield-algorand-x402.vercel.app](https://vibeshield-algorand-x402.vercel.app)
* **Algorand Recipient Wallet:** `GPKZWR5VVQFR7NATTDNZ53ZDFAK5LSW6T5K4ZWLIWIOYUTYPXDZWAEBUFA`
* **Verified Algorand Testnet Transaction (Lora Explorer):**  
  👉 [https://lora.algokit.io/testnet/transaction/H7XJLC33ODGPBLIMRBEULXQMH3ZDRTKCTWPXKYZUM5VR4CS2U3AQ](https://lora.algokit.io/testnet/transaction/H7XJLC33ODGPBLIMRBEULXQMH3ZDRTKCTWPXKYZUM5VR4CS2U3AQ)

---

## 💻 Instructions to Run & Test Locally

### Prerequisites
* Node.js v18+ 
* npm / yarn

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nikhil24x5183-netizen/securityscanner.git
   cd securityscanner
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tech Stack & Dependencies

* **Frontend & Architecture:** Next.js 16 (App Router), React 19, TypeScript
* **Styling & Motion:** Tailwind CSS, Framer Motion, Lucide Icons
* **In-Browser SAST Engine:** JSZip API, HTML5 File System API, Custom Character-Offset Locator
* **Blockchain & x402 Protocol:** `@x402/avm`, `@x402/core`, `algosdk` (Algorand JavaScript SDK)
* **Deployment:** Vercel Cloud Platform
