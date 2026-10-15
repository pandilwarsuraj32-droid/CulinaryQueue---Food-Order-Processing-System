import React, { useState } from 'react';
import { 
  Download, 
  Github, 
  Check, 
  Copy, 
  FolderArchive, 
  FileCode, 
  Terminal, 
  ExternalLink,
  X,
  FileCheck
} from 'lucide-react';
import { createProjectZipBlob, downloadBlobAsFile } from '../utils/zipGenerator';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [isPackaging, setIsPackaging] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setIsPackaging(true);
    setDownloadProgress(10);
    try {
      // First try to download the pre-packaged physical zip file directly from /culinaryqueue-food-order-processing-system.zip
      const staticResponse = await fetch('/culinaryqueue-food-order-processing-system.zip');
      if (staticResponse.ok) {
        const blob = await staticResponse.blob();
        setDownloadProgress(100);
        downloadBlobAsFile(blob, 'culinaryqueue-food-order-processing-system.zip');
        setTimeout(() => setIsPackaging(false), 800);
        return;
      }
    } catch {
      // Fallback to client-side JSZip generator
    }

    try {
      const blob = await createProjectZipBlob((percent) => {
        setDownloadProgress(percent);
      });
      downloadBlobAsFile(blob, 'culinaryqueue-food-order-processing-system.zip');
    } catch (err) {
      console.error('Failed to create zip', err);
    } finally {
      setTimeout(() => setIsPackaging(false), 800);
    }
  };

  const gitSteps = [
    {
      title: '1. Extract ZIP & Open Terminal',
      cmd: `unzip culinaryqueue-food-order-processing-system.zip -d culinaryqueue\ncd culinaryqueue`
    },
    {
      title: '2. Initialize Git Repository & Commit',
      cmd: `git init\ngit add .\ngit commit -m "feat: Online Food Order Processing System with FIFO Queue data structure"`
    },
    {
      title: '3. Push to GitHub',
      cmd: `git branch -M main\ngit remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/culinaryqueue.git\ngit push -u origin main`
    }
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-neutral-900 text-white rounded-xl">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                GitHub Repository & ZIP Package
              </h2>
              <p className="text-xs text-neutral-500">
                Download the complete codebase bundled for instant upload to GitHub
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Download Action Card */}
          <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-bold text-amber-950">
                  culinaryqueue-food-order-processing-system.zip
                </h3>
              </div>
              <p className="text-xs text-amber-900/80">
                Includes all source code, FIFO queue models, menu images, documentation, and configuration files.
              </p>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isPackaging}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{isPackaging ? `Packaging (${downloadProgress}%)...` : 'Download ZIP File'}</span>
            </button>
          </div>

          {/* Repository File Structure Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-500">
              Included Files & Manifest
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-neutral-50 p-3 rounded-lg border border-neutral-200/80">
              <div className="flex items-center gap-2 text-neutral-700">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>README.md (Docs & DSA)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>package.json & configs</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>src/models/FifoQueue.ts</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>src/context/OrderSystemContext.tsx</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>src/components/* (KDS, Menu, DSA)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>src/assets/images/* (Food assets)</span>
              </div>
            </div>
          </div>

          {/* Quickstart Upload Guide */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-neutral-700" />
                <span>How to Upload to GitHub</span>
              </h4>
            </div>

            <div className="space-y-3">
              {gitSteps.map((step, idx) => (
                <div key={idx} className="bg-neutral-900 rounded-xl p-3.5 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="font-semibold text-neutral-200">{step.title}</span>
                    <button
                      onClick={() => copyToClipboard(step.cmd, idx)}
                      className="hover:text-white p-1 rounded transition-colors inline-flex items-center gap-1 text-[11px]"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-sans">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="font-sans">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-amber-300 text-[11px] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {step.cmd}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <span>License: MIT · Compatible with Node 18+</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
