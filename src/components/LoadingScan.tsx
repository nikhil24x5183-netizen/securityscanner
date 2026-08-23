"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Search, Terminal } from "lucide-react";

const SCAN_STEPS = [
  "Extracting compressed zip payload...",
  "Filtering out non-code assets and node_modules...",
  "Constructing Abstract Syntax Tree & code chunks...",
  "Querying Gemini/OpenAI for vulnerabilities & syntax flaws...",
  "Formatting structured security risk report..."
];

interface LoadingScanProps {
  fileName?: string;
  fileCount?: number;
}

export const LoadingScan: React.FC<LoadingScanProps> = ({ fileName, fileCount }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Radar scanning ring graphic */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-[#5E0ED7]/40"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute inset-2 rounded-full bg-[#5E0ED7]/10 border border-[#5E0ED7]/30"
        />
        <div className="relative z-10 p-4 rounded-full bg-black border border-[#5E0ED7]/50 shadow-[0_0_30px_rgba(94,14,215,0.3)] text-[#00FF9D]">
          <Cpu className="w-10 h-10 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-wide">
        AI Code Review in Progress
      </h3>
      {fileName && (
        <p className="text-xs text-zinc-500 font-mono mb-4">
          TARGET: {fileName} ({fileCount || 1} FILES)
        </p>
      )}

      {/* Console log ticker */}
      <div className="w-full bg-[#09090b] rounded-2xl border border-zinc-800 p-4 text-left font-mono text-xs shadow-inner">
        <div className="flex items-center space-x-2 pb-2 mb-2 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5" />
          <span>VibeShield Engine Audit Logs</span>
        </div>
        <div className="space-y-1.5 min-h-[80px]">
          {SCAN_STEPS.slice(0, currentStep + 1).map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-[#00FF9D]"
            >
              <Search className="w-3 h-3 text-[#5E0ED7] shrink-0" />
              <span>{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
