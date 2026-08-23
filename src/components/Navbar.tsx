"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X, ShieldCheck, Zap } from "lucide-react";

interface NavbarProps {
  onScanClick: () => void;
  onDemoClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScanClick, onDemoClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "SCANNER", href: "#scanner", action: onScanClick },
    { name: "DOCUMENTATION", href: "#docs", action: () => alert("Vibesheid Documentation:\n- Supports Python, JS/TS, Java, Go, C++, PHP, SQL\n- Max Zip payload: 50MB\n- Automated ignore list for node_modules, .git, .venv") },
    { name: "FEATURES", href: "#features", action: () => alert("Features:\n1. 4 Input Modes (Folder, Zip, Files, Paste Code)\n2. Sub-second AST AST analysis\n3. Security Health Score (0-100) & Grade A+-F\n4. Copy-paste Code Fix snippets") },
    { name: "RULES", href: "#rules", action: () => alert("Scanner Rules:\n- Scans for SQL Injection, XSS, Hardcoded Credentials, and Logic Flaws.\n- Outputs strict structured JSON results.") },
  ];

  return (
    <header className="relative z-50 w-full px-6 py-5 flex items-center justify-between border-b border-white/10 backdrop-blur-md">
      {/* Minimalist White Logo */}
      <div 
        onClick={onScanClick}
        className="flex items-center space-x-3 cursor-pointer group select-none"
      >
        <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-white group-hover:bg-[#5ed29c] group-hover:text-[#070b0a] transition-all duration-300">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-xl font-bold tracking-tight text-white uppercase font-inter">
            Vibesheid
          </span>
          <span className="text-[#5ed29c] font-mono text-xl font-black">.ai</span>
        </div>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <button
            key={link.name}
            onClick={link.action}
            className="text-[16px] font-inter font-semibold text-white/80 hover:text-[#5ed29c] tracking-wider transition-colors uppercase"
          >
            {link.name}
          </button>
        ))}
      </nav>

      {/* CTA Button Desktop */}
      <div className="hidden md:flex items-center space-x-4">
        <button
          onClick={onDemoClick}
          className="px-6 py-2.5 rounded-full bg-[#5ed29c] hover:bg-[#4ec08b] text-[#070b0a] font-inter font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-[#5ed29c]/20 hover:scale-105 transition-all"
        >
          <span>Try Demo Scan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2 rounded-lg bg-white/10 text-white hover:text-[#5ed29c] transition-colors"
        aria-label="Toggle Navigation Menu"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[73px] bg-[#070b0a]/95 backdrop-blur-2xl z-50 flex flex-col justify-between p-8 md:hidden"
          >
            <div className="space-y-6 pt-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    link.action();
                  }}
                  className="block w-full text-left text-2xl font-inter font-extrabold text-white hover:text-[#5ed29c] tracking-wider uppercase border-b border-white/10 pb-4 transition-colors"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-6">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onDemoClick();
                }}
                className="w-full py-4 rounded-full bg-[#5ed29c] text-[#070b0a] font-inter font-bold text-sm uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <span>Get Started - Demo Scan</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
