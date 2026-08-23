"use client";

import React, { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";

interface CodeViewerProps {
  code: string;
  language?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div className="relative group rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 font-mono text-sm shadow-inner">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">Suggested Fix Code</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700/50"
          title="Copy solution code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto text-slate-200">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                <td className="w-10 select-none text-right pr-4 text-slate-600 font-mono text-xs">
                  {idx + 1}
                </td>
                <td className="whitespace-pre font-mono text-xs leading-relaxed text-emerald-300">
                  {line || " "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
