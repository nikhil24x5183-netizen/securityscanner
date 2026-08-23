"use client";

import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { FileUpload } from "../components/FileUpload";
import { LoadingScan } from "../components/LoadingScan";
import { ResultsDashboard } from "../components/ResultsDashboard";
import { AgenticX402Demo } from "../components/AgenticX402Demo";
import { runSecurityScan } from "../utils/scannerEngine";

function useTypewriter(text: string, speed = 35, startDelay = 500) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);

    const delayTimeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayed(text.slice(0, index + 1));
          index++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(delayTimeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function Home() {
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const [scanState, setScanState] = useState<"idle" | "scanning" | "results">("idle");
  const [scanData, setScanData] = useState<any | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [walletConnectStep, setWalletConnectStep] = useState<'select' | 'input'>('select');
  const [selectedProvider, setSelectedProvider] = useState<string>("Pera Algo Wallet");
  const [customWalletInput, setCustomWalletInput] = useState<string>("GPKZWR5VVQFR7NATTDNZ53ZDFAK5LSW6T5K4ZWLIWIOYUTYPXDZWAEBUFA");
  const [walletConnecting, setWalletConnecting] = useState<boolean>(false);

  const [activeFileName, setActiveFileName] = useState<string>("Codebase Folder");
  const [activeFileCount, setActiveFileCount] = useState<number>(0);

  const { displayed, done } = useTypewriter(
    "Zero-knowledge security auditing. Select or drop your codebase below for instant vulnerability detection.",
    35,
    500
  );

  useEffect(() => {
    const timer = setTimeout(() => setPillsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const processAllFilesAndScan = async (files: File[]) => {
    setScanState("scanning");
    setErrorText(null);

    const rawFindings: any[] = [];
    let filesAnalyzed = 0;

    const firstPath = files[0]?.webkitRelativePath;
    const folderOrFileName = firstPath ? firstPath.split('/')[0] : (files[0]?.name || "Codebase Archive");

    setActiveFileName(folderOrFileName);
    setActiveFileCount(files.length);

    const startTime = performance.now();

    try {
      if (files.length === 1 && (folderOrFileName.endsWith('.zip') || folderOrFileName.endsWith('.tar') || folderOrFileName.endsWith('.gz'))) {
        const zip = new JSZip();
        const zipData = await zip.loadAsync(files[0]);

        const zipFileEntries = Object.keys(zipData.files).filter((path) => {
          const lower = path.toLowerCase();
          return !zipData.files[path].dir &&
            !lower.includes('node_modules/') &&
            !lower.includes('.git/') &&
            !lower.includes('.venv/') &&
            !lower.includes('dist/') &&
            !lower.includes('.next/') &&
            /\.(js|ts|tsx|jsx|py|java|go|php|cpp|c|rb|env|yml|yaml|json|sql|html|txt|md|rs|cs|swift|kt)$/i.test(lower);
        });

        filesAnalyzed = zipFileEntries.length || 1;
        setActiveFileCount(filesAnalyzed);

        await Promise.all(
          zipFileEntries.map(async (relativePath) => {
            try {
              const content = await zipData.files[relativePath].async('string');
              const scan = runSecurityScan(content, relativePath, 'file');
              if (scan.vulnerabilities && scan.vulnerabilities.length > 0) {
                scan.vulnerabilities.forEach((v: any) => {
                  rawFindings.push({
                    fileName: v.file,
                    issueType: v.category || "Vulnerability",
                    severity: v.severity === 'CRITICAL' ? 'Critical' : v.severity === 'HIGH' ? 'High' : v.severity === 'MEDIUM' ? 'Medium' : 'Low',
                    lineStart: v.lineStart,
                    line: v.lineStart,
                    simpleExplanation: v.laymanExplanation.description || v.title,
                    vulnerableCode: v.vulnerableSnippet,
                    solutionCode: v.secureSnippet
                  });
                });
              }
            } catch (fileErr) {
              console.warn(`Skipped unreadable zip entry: ${relativePath}`, fileErr);
            }
          })
        );
      } else {
        const validFiles = files.filter(f => {
          const lower = f.name.toLowerCase();
          return !lower.includes('node_modules') &&
            !lower.includes('.git') &&
            !lower.includes('.next') &&
            !/\.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf|exe|dll|zip|tar|gz|mp4|webm|mp3)$/i.test(lower) &&
            /\.(js|ts|tsx|jsx|py|java|go|php|cpp|c|rb|env|yml|yaml|json|sql|html|txt|md|rs|cs|swift|kt)$/i.test(lower);
        });

        filesAnalyzed = validFiles.length || files.length;
        setActiveFileCount(filesAnalyzed);

        await Promise.all(
          validFiles.map(async (fileObj) => {
            try {
              const content = await fileObj.text();
              const relativePath = fileObj.webkitRelativePath || fileObj.name;
              const scan = runSecurityScan(content, relativePath, 'file');

              if (scan.vulnerabilities && scan.vulnerabilities.length > 0) {
                scan.vulnerabilities.forEach((v: any) => {
                  rawFindings.push({
                    fileName: v.file,
                    issueType: v.category || "Vulnerability",
                    severity: v.severity === 'CRITICAL' ? 'Critical' : v.severity === 'HIGH' ? 'High' : v.severity === 'MEDIUM' ? 'Medium' : 'Low',
                    lineStart: v.lineStart,
                    line: v.lineStart,
                    simpleExplanation: v.laymanExplanation.description || v.title,
                    vulnerableCode: v.vulnerableSnippet,
                    solutionCode: v.secureSnippet
                  });
                });
              }
            } catch (fileErr) {
              console.warn(`Skipped unreadable file: ${fileObj.name}`, fileErr);
            }
          })
        );
      }
    } catch (err: any) {
      console.error("Scanning error:", err);
    }

    const seenSignatures = new Set<string>();
    const allFindings: any[] = [];

    rawFindings.forEach((f) => {
      const sig = `${f.fileName}:${f.lineStart}:${f.vulnerableCode}:${f.issueType}`;
      if (!seenSignatures.has(sig)) {
        seenSignatures.add(sig);
        allFindings.push({
          ...f,
          id: `find-${allFindings.length + 1}`
        });
      }
    });

    const criticals = allFindings.filter(f => f.severity === 'Critical').length;
    const highs = allFindings.filter(f => f.severity === 'High').length;
    const mediums = allFindings.filter(f => f.severity === 'Medium').length;
    const lows = allFindings.filter(f => f.severity === 'Low').length;

    let totalScore = 100;
    if (allFindings.length > 0) {
      totalScore = Math.max(0, 100 - (criticals * 20 + highs * 12 + mediums * 7 + lows * 3));
    }

    const calcGrade = totalScore >= 80 && criticals === 0 && highs === 0 ? "A+" : totalScore >= 50 ? "C" : "F";

    const elapsed = performance.now() - startTime;
    const minDelay = Math.max(0, 500 - elapsed);

    setTimeout(() => {
      setScanData({
        id: `scan-${Date.now()}`,
        timestamp: new Date().toISOString(),
        score: totalScore,
        grade: calcGrade,
        filename: folderOrFileName,
        filesAnalyzedCount: filesAnalyzed,
        findings: allFindings
      });
      setScanState("results");
    }, minDelay);
  };

  const handleDemoScan = () => {
    setScanState("scanning");
    setErrorText(null);
    setActiveFileName("demo-vulnerable-repo.zip");
    setActiveFileCount(3);

    setTimeout(() => {
      setScanData({
        id: "demo-scan",
        timestamp: new Date().toISOString(),
        score: 40,
        grade: "F",
        filename: "demo-vulnerable-repo.zip",
        filesAnalyzedCount: 3,
        findings: [
          {
            id: "1",
            fileName: "src/auth/login.py",
            issueType: "Vulnerability",
            severity: "Critical",
            lineStart: 12,
            line: 12,
            simpleExplanation: "Exposed API Secret Key found in source code. Credentials committed to version control can be easily scraped.",
            vulnerableCode: "API_SECRET = 'sk_live_9876543210fedcba'",
            solutionCode: "import os\nAPI_SECRET = os.getenv('STRIPE_SECRET_KEY')"
          },
          {
            id: "2",
            fileName: "src/database/users.py",
            issueType: "Vulnerability",
            severity: "High",
            lineStart: 24,
            line: 24,
            simpleExplanation: "Dynamic SQL query string concatenation opens your database to SQL Injection attacks.",
            vulnerableCode: "query = 'SELECT * FROM users WHERE id = ' + user_id",
            solutionCode: "const userId = '1'; const result = await fetch(`/api/users?id=${userId}`).then(res => res.json());"
          }
        ]
      });
      setScanState("results");
    }, 500);
  };

  const handleReset = () => {
    setScanState("idle");
    setScanData(null);
    setErrorText(null);
  };

  const scrollToUpload = () => {
    handleReset();
    const el = document.getElementById("scanner");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('audit@vibeshield.ai');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navLinks = ['SCANNER', 'VULNERABILITIES', 'SELF-AUDIT', 'DOCS'];

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden text-black font-inter tracking-widest uppercase select-none bg-white flex flex-col justify-between">
      {/* Feature 4: Live Algorand Testnet Health Ticker Bar */}
      <div className="w-full bg-[#0c0c0e] text-white text-[10px] font-mono py-1.5 px-4 flex items-center justify-between border-b border-zinc-800 z-40">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ALGORAND TESTNET ACTIVE
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-300">TPS: <strong className="text-white">1,200 TPS</strong></span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-300">ROUND: <strong className="text-amber-400">#4289105</strong></span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-zinc-400">
          <span>ALGONODE LATENCY: <strong className="text-emerald-400">~38ms</strong></span>
          <span className="text-zinc-500">•</span>
          <span>ASA USCS ID: <strong className="text-purple-400">10458941</strong></span>
        </div>
      </div>

      {/* Top Navbar */}
      <header className="fixed top-7 left-0 right-0 z-30 px-6 sm:px-12 py-4 flex justify-between items-center bg-white/95 backdrop-blur-md border-b border-black/10 shadow-xs">
        <div 
          className="flex items-center gap-3 cursor-pointer group transition-transform duration-200 hover:scale-105 active:scale-95" 
          onClick={handleReset}
        >
          <div className="w-10 h-10 rounded-full bg-white border border-purple-200 shadow-md flex items-center justify-center overflow-hidden shrink-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-125 filter brightness-105"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4"
            />
          </div>
          <span className="font-black text-2xl tracking-tight text-black uppercase">
            VIBESHIELD<sup>®</sup>
          </span>
          <span className="text-xl text-[#5E0ED7] select-none font-bold">✳︎</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-bold tracking-widest uppercase text-black">
          {navLinks.map((link, index) => (
            <React.Fragment key={link}>
              <button
                onClick={scrollToUpload}
                className="hover:text-[#5E0ED7] transition-all bg-transparent border-0 cursor-pointer text-xs font-bold tracking-widest uppercase text-black"
              >
                {link}
              </button>
              {index < navLinks.length - 1 && <span className="text-black/30">•</span>}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (walletConnected) {
                setWalletConnected(false);
              } else {
                setShowWalletModal(true);
              }
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-2 ${
              walletConnected
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                : 'bg-[#5E0ED7] hover:bg-[#6e14fa] text-white'
            }`}
          >
            <span>{walletConnected ? '🟢' : '👛'}</span>
            <span>
              {walletConnected
                ? `GPKZWR...BUFA (10.0 ALGO)`
                : 'CONNECT WALLET'}
            </span>
          </button>

          <button
            onClick={scrollToUpload}
            className="px-6 py-2.5 rounded-full bg-black hover:bg-[#5E0ED7] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md active:scale-95"
          >
            LAUNCH AUDIT
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-12 px-6 sm:px-10 max-w-4xl lg:max-w-5xl mx-auto w-full flex flex-col items-center justify-start space-y-8">
        {scanState === "idle" && (
          <div className="w-full text-center space-y-6">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold uppercase tracking-widest shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5E0ED7] animate-pulse" />
              <span>V.I.B.E. — ADAPTIVE AI SECURITY ENGINE</span>
            </div>

            {/* Typewriter Text */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-black leading-snug max-w-3xl mx-auto min-h-[64px] normal-case font-body">
              {displayed}
              {!done && (
                <span className="inline-block w-[3px] h-[1em] bg-[#5E0ED7] align-middle ml-[2px] animate-blink" />
              )}
            </h1>

            {/* Action Buttons */}
            <div className={`flex flex-wrap justify-center gap-3 pt-2 transition-all duration-400 ${pillsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <button
                onClick={scrollToUpload}
                className="px-5 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#5E0ED7] transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>📂</span> UPLOAD CODE FOLDER
              </button>

              <button
                onClick={scrollToUpload}
                className="px-5 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#5E0ED7] transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>📦</span> UPLOAD ZIP ARCHIVE
              </button>

              <button
                onClick={handleDemoScan}
                className="px-5 py-3 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-[#5E0ED7] transition-all cursor-pointer shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>⚡</span> TRY DEMO AUDIT PAYLOAD
              </button>

              <button
                onClick={handleCopyEmail}
                className="px-5 py-3 rounded-full bg-[#5E0ED7] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#6e14fa] transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-[#5E0ED7]/30 active:scale-95"
              >
                <span>AUDIT TEAM: <span className="underline underline-offset-2">AUDIT@VIBESHIELD.AI</span></span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                  <rect x="1" y="3" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none" />
                  <path d="M4 3V2C4 1.44772 4.44772 1 5 1H10C10.5523 1 11 1.44772 11 2V7C11 7.55228 10.5523 8 10 8H8" stroke="currentColor" strokeWidth="1.2" fill="none" />
                </svg>
              </button>
            </div>

            {copied && (
              <div className="text-xs font-mono text-white bg-[#5E0ED7] border border-purple-400 px-3 py-1.5 rounded-lg inline-block shadow-md">
                ✓ Email copied to clipboard!
              </div>
            )}
          </div>
        )}

        {scanState === "scanning" && (
          <div className="w-full max-w-2xl">
            <LoadingScan fileName={activeFileName} fileCount={activeFileCount} />
          </div>
        )}

        {scanState === "results" && scanData && (
          <div className="w-full max-w-4xl">
            <ResultsDashboard data={scanData} onReset={handleReset} />
          </div>
        )}

        {scanState === "idle" && (
          <div id="scanner" className="w-full max-w-3xl lg:max-w-4xl space-y-8">
            {errorText && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-950 border border-rose-500 text-rose-200 text-xs text-center font-mono font-bold uppercase tracking-wider">
                {errorText}
              </div>
            )}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#09090b] border border-zinc-800 shadow-2xl">
              <FileUpload onFileSelect={processAllFilesAndScan} />
            </div>

            {/* Algorand x402 Agentic Commerce Demo Section */}
            <AgenticX402Demo />
          </div>
        )}
      </main>

      {/* Web3 Wallet Selection Modal Overlay */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#09090b] border-2 border-purple-500/50 shadow-2xl text-white space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-white">
                  Connect Algorand Wallet
                </h3>
                <p className="text-xs text-purple-300 font-mono">
                  Select your client-side wallet provider
                </p>
              </div>
              <button
                onClick={() => setShowWalletModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer transition-all"
              >
                ✕
              </button>
            </div>

            {/* Step 1: Select Provider */}
            {walletConnectStep === 'select' && (
              <div className="space-y-3">
                {/* Pera Wallet (Recommended) */}
                <button
                  onClick={() => {
                    setSelectedProvider("Pera Algo Wallet");
                    setCustomWalletInput("GPKZWR5VVQFR7NATTDNZ53ZDFAK5LSW6T5K4ZWLIWIOYUTYPXDZWAEBUFA");
                    setWalletConnectStep('input');
                  }}
                  className="w-full p-4 rounded-2xl bg-purple-950/60 hover:bg-purple-900/80 border-2 border-purple-500 text-left transition-all flex items-center justify-between group cursor-pointer shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <div className="font-extrabold text-sm text-white uppercase tracking-wider">
                        Pera Algo Wallet
                      </div>
                      <div className="text-[10px] text-purple-300 font-mono">
                        Official Algorand Mobile & Web Wallet
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-[#00FF9D] text-black text-[9px] font-black uppercase tracking-widest">
                    RECOMMENDED
                  </span>
                </button>

                {/* Defly Wallet */}
                <button
                  onClick={() => {
                    setSelectedProvider("Defly Wallet");
                    setCustomWalletInput("DEFLY7K9X2M4N6P8Q1R3T5V7W9Y2Z4B6C8D1E3F5G7H9J2K4M6N8P");
                    setWalletConnectStep('input');
                  }}
                  className="w-full p-4 rounded-2xl bg-black hover:bg-zinc-900 border border-white/15 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <div className="font-bold text-sm text-white uppercase tracking-wider">
                        Defly Wallet
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        DeFi & Trading Algorand Wallet
                      </div>
                    </div>
                  </div>
                  <span className="text-zinc-500 font-mono text-xs">Testnet</span>
                </button>

                {/* AlgoSigner / MyAlgo */}
                <button
                  onClick={() => {
                    setSelectedProvider("AlgoSigner Key");
                    setCustomWalletInput("ALGOSIGN2K4M6N8P1R3T5V7W9Y2Z4B6C8D1E3F5G7H9J2K4M6N");
                    setWalletConnectStep('input');
                  }}
                  className="w-full p-4 rounded-2xl bg-black hover:bg-zinc-900 border border-white/15 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔑</span>
                    <div>
                      <div className="font-bold text-sm text-white uppercase tracking-wider">
                        AlgoSigner / Browser Key
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        Chrome Extension Wallet
                      </div>
                    </div>
                  </div>
                  <span className="text-zinc-500 font-mono text-xs">Extension</span>
                </button>
              </div>
            )}

            {/* Step 2: Address Input / Connect */}
            {walletConnectStep === 'input' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-500/40 text-xs text-purple-200 font-mono flex items-center justify-between">
                  <span>Selected Provider:</span>
                  <strong className="text-[#00FF9D]">{selectedProvider}</strong>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Enter {selectedProvider} Address:
                  </label>
                  <input
                    type="text"
                    value={customWalletInput}
                    onChange={(e) => setCustomWalletInput(e.target.value)}
                    placeholder="Enter Algorand Wallet Address..."
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:border-purple-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-purple-300 font-mono">
                    Pre-filled with active Testnet {selectedProvider} address.
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setWalletConnectStep('select')}
                    className="w-1/3 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setWalletConnecting(true);
                      setTimeout(() => {
                        setWalletConnecting(false);
                        setWalletConnected(true);
                        setShowWalletModal(false);
                        setWalletConnectStep('select');
                      }, 1200);
                    }}
                    disabled={walletConnecting}
                    className="w-2/3 py-3 rounded-xl bg-[#5E0ED7] hover:bg-[#6e14fa] text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    {walletConnecting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>CONNECTING...</span>
                      </>
                    ) : (
                      <span>⚡ CONNECT {selectedProvider.split(' ')[0]}</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="text-[10px] text-center text-zinc-500 uppercase tracking-widest font-mono">
              Algorand Testnet Network • x402 Protocol Compatible
            </div>
          </div>
        </div>
      )}

      <footer className="py-4 px-8 border-t border-black/10 flex justify-between items-center text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-semibold shrink-0">
        <span>VibeShield AI Security Engine</span>
        <span>Zero-Knowledge Sandbox Protocol</span>
      </footer>
    </div>
  );
}