"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

export const LiquidGlassCard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="liquid-glass-card translate-y-[-50px] p-5 flex flex-col justify-between text-left shrink-0 shadow-2xl z-20 group hover:scale-[1.03] transition-transform duration-300"
    >
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-mono font-bold text-[#5ed29c] tracking-wide">
          [ 2026 AUDIT ]
        </span>
        <div className="p-1 rounded-full bg-[#5ed29c]/10 border border-[#5ed29c]/30 text-[#5ed29c]">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="my-auto space-y-1">
        <h4 className="text-[18px] font-semibold text-slate-100 leading-snug">
          Powered by <span className="font-serif-italic font-normal text-white">Industry</span> Security Intelligence
        </h4>
      </div>

      <p className="text-[11px] text-slate-400 font-inter leading-relaxed">
        Sub-second AST static analysis & automated threat remediation.
      </p>
    </motion.div>
  );
};
