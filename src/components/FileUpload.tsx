import React, { useState } from 'react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [activeTab, setActiveTab] = useState<'folder' | 'zip' | 'files' | 'paste' | 'github'>('folder');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileLabel, setSelectedFileLabel] = useState<string | null>(null);
  const [fileCountLabel, setFileCountLabel] = useState<number>(0);
  const [isProcessingUpload, setIsProcessingUpload] = useState<boolean>(false);
  const [codeContent, setCodeContent] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [githubError, setGithubError] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = (filesList: File[]) => {
    if (!filesList || filesList.length === 0) return;
    setIsProcessingUpload(true);
    
    const folderPath = filesList[0].webkitRelativePath;
    const folderName = folderPath ? folderPath.split('/')[0] : filesList[0].name;

    setSelectedFileLabel(folderName);
    setFileCountLabel(filesList.length);
    
    onFileSelect(filesList);
  };

  const handleDragDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedFileLabel(null);
    setFileCountLabel(0);
    setIsProcessingUpload(false);
  };

  const handlePasteSubmit = () => {
    if (!codeContent.trim()) return;
    const blob = new Blob([codeContent], { type: 'text/plain' });
    const file = new File([blob], 'pasted_code.ts', { type: 'text/plain' });
    processFiles([file]);
  };

  const handleGithubSubmit = async () => {
    setGithubError(null);
    const cleanUrl = githubUrl.trim();
    if (!cleanUrl) return;

    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      setGithubError("⚠️ Please enter a valid public GitHub repository URL (e.g., https://github.com/owner/repo)");
      return;
    }

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, '');

    try {
      setIsProcessingUpload(true);
      setSelectedFileLabel(`${owner}/${repo}`);
      
      const zipRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/zipball`);
      if (!zipRes.ok) {
        throw new Error(`GitHub API returned status ${zipRes.status}. Make sure the repository is public.`);
      }

      const blob = await zipRes.blob();
      const zipFile = new File([blob], `${repo}.zip`, { type: 'application/zip' });
      processFiles([zipFile]);
    } catch (err: any) {
      setIsProcessingUpload(false);
      setSelectedFileLabel(null);
      setGithubError(err?.message || "Failed to fetch GitHub repository.");
    }
  };

  return (
    <div className="w-full space-y-4 font-inter text-white">
      {/* Mode Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <button
          onClick={() => setActiveTab('folder')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'folder'
              ? 'bg-[#5E0ED7] text-white shadow-lg shadow-[#5E0ED7]/40 border border-purple-400/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>📁</span>
          <span>UPLOAD FOLDER</span>
        </button>

        <button
          onClick={() => setActiveTab('zip')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'zip'
              ? 'bg-[#5E0ED7] text-white shadow-lg shadow-[#5E0ED7]/40 border border-purple-400/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>📦</span>
          <span>ZIP ARCHIVE</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'files'
              ? 'bg-[#5E0ED7] text-white shadow-lg shadow-[#5E0ED7]/40 border border-purple-400/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>📄</span>
          <span>CODE FILES</span>
        </button>

        <button
          onClick={() => setActiveTab('paste')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'paste'
              ? 'bg-[#5E0ED7] text-white shadow-lg shadow-[#5E0ED7]/40 border border-purple-400/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>✏️</span>
          <span>PASTE CODE</span>
        </button>

        <button
          onClick={() => setActiveTab('github')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'github'
              ? 'bg-[#5E0ED7] text-white shadow-lg shadow-[#5E0ED7]/40 border border-purple-400/40 font-extrabold'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>🐙</span>
          <span>GITHUB REPO</span>
        </button>
      </div>

      {/* Upload Status Banner */}
      {selectedFileLabel && (
        <div className="p-4 rounded-2xl bg-[#14080b] border-2 border-[#00FF9D]/60 flex items-center justify-between gap-3 shadow-2xl shadow-[#00FF9D]/10 animate-fade-in">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-2xl animate-spin">⚡</span>
            <div className="truncate">
              <span className="text-xs font-black text-[#00FF9D] uppercase tracking-wider block truncate">
                {isProcessingUpload ? '⏳ FOLDER UPLOADING & ANALYZING...' : 'FOLDER UPLOADED & ANALYZED'}
              </span>
              <span className="text-[11px] text-white font-mono font-bold block truncate">
                📄 {selectedFileLabel} ({fileCountLabel} FILES DETECTED)
              </span>
            </div>
          </div>

          <button
            onClick={handleClearSelection}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>✕</span>
            <span>REMOVE</span>
          </button>
        </div>
      )}

      {/* GitHub Error Alert */}
      {githubError && (
        <div className="p-3.5 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-xs font-bold text-rose-200 text-center animate-bounce shadow-lg">
          {githubError}
        </div>
      )}

      {/* Mode 1: GitHub Repository Input */}
      {activeTab === 'github' ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-purple-500/40 space-y-4 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
            <span className="text-2xl">🐙</span>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Public GitHub Repository Scanner</h3>
              <p className="text-[11px] text-purple-300 font-mono">Enter any public GitHub repository URL to fetch and audit live source code.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">GitHub Repository URL:</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                className="flex-1 p-3.5 rounded-2xl bg-black/80 border border-zinc-700 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#5E0ED7]"
              />
              <button
                onClick={handleGithubSubmit}
                disabled={isProcessingUpload || !githubUrl.trim()}
                className="px-6 py-3.5 rounded-2xl bg-[#5E0ED7] hover:bg-[#6e14fa] disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#5E0ED7]/40 shrink-0 flex items-center justify-center gap-2 active:scale-95"
              >
                {isProcessingUpload ? '⏳ FETCHING GITHUB REPO...' : '🐙 FETCH & SCAN GITHUB REPO'}
              </button>
            </div>
          </div>

          {/* Preset Sample GitHub Repos */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-400">
            <span className="text-zinc-500 font-bold uppercase">Sample Repos:</span>
            <button
              type="button"
              onClick={() => setGithubUrl('https://github.com/nikhil24x5183-netizen/securityscanner')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
            >
              VibeShield Repo
            </button>
            <button
              type="button"
              onClick={() => setGithubUrl('https://github.com/algorand/pyteal')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300 border border-emerald-500/30 transition-all cursor-pointer"
            >
              Algorand PyTeal Repo
            </button>
          </div>
        </div>
      ) : activeTab === 'paste' ? (
        <div className="p-6 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-white/15 space-y-4 shadow-2xl">
          <textarea
            value={codeContent}
            onChange={(e) => setCodeContent(e.target.value)}
            placeholder="// Paste raw source code snippet here for instant security audit..."
            className="w-full h-48 p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#5E0ED7] resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handlePasteSubmit}
              disabled={!codeContent.trim()}
              className="flex-1 py-3 rounded-2xl bg-[#5E0ED7] hover:bg-[#6e14fa] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-[#5E0ED7]/40"
            >
              AUDIT CODE SNIPPET
            </button>
            {codeContent && (
              <button
                onClick={() => setCodeContent('')}
                className="px-4 py-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDragDrop}
          className={`relative p-10 sm:p-12 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center space-y-4 ${
            dragActive
              ? 'border-[#5E0ED7] bg-[#5E0ED7]/20 backdrop-blur-2xl shadow-2xl shadow-[#5E0ED7]/40 scale-[1.01]'
              : 'border-white/15 bg-slate-950/80 backdrop-blur-2xl hover:border-[#5E0ED7]/50 hover:bg-slate-900 shadow-2xl'
          }`}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            onChange={handleChange}
            {...(activeTab === 'folder' ? ({ webkitdirectory: '', directory: '' } as any) : {})}
            multiple={activeTab === 'files' || activeTab === 'folder'}
            accept={activeTab === 'zip' ? '.zip,.tar,.gz' : undefined}
          />

          <div className="w-16 h-16 rounded-2xl bg-[#5E0ED7]/20 border border-purple-400/30 flex items-center justify-center text-amber-400 text-3xl shadow-xl shadow-[#5E0ED7]/20">
            {activeTab === 'folder' ? '📂' : activeTab === 'zip' ? '📦' : '📄'}
          </div>

          <div className="space-y-1 z-10">
            <h3 className="text-xl font-black text-white uppercase tracking-wider">
              {activeTab === 'folder'
                ? 'SELECT OR DRAG & DROP A CODE FOLDER'
                : activeTab === 'zip'
                ? 'SELECT OR DRAG & DROP A ZIP ARCHIVE'
                : 'SELECT OR DRAG & DROP SOURCE FILES'}
            </h3>
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">
              CLICK ANYWHERE TO BROWSE FILES ON YOUR SYSTEM
            </p>
          </div>
        </div>
      )}
    </div>
  );
}