
import React, { useState } from 'react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, domain }) => {
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const scriptCode = `<!-- Smiles To Miles AI Agent -->
<script>
  window.STM_CONFIG = {
    apiKey: "STM_LIVE_9625688486",
    domain: "${domain}",
    theme: "light"
  };
</script>
<script src="https://cdn.smilestomiles.com/agent.v2.js" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runVerification = () => {
    setVerifying(true);
    setStatus('idle');
    // Simulate API check
    setTimeout(() => {
      setVerifying(false);
      setStatus('success');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Website Verification</h3>
              <p className="text-sm text-slate-500">Connect {domain} to your AI Hub</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
              <div>
                <p className="font-semibold text-slate-800">Copy the integration snippet</p>
                <p className="text-sm text-slate-500">This script initializes the AI chat widget on your site.</p>
              </div>
            </div>

            <div className="relative group">
              <pre className="bg-slate-900 text-indigo-300 p-5 rounded-xl text-sm font-mono overflow-x-auto border border-slate-800 shadow-inner leading-relaxed">
                {scriptCode}
              </pre>
              <button 
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-2 shadow-lg"
              >
                {copied ? 'Copied!' : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
              <div>
                <p className="font-semibold text-slate-800">Paste in &lt;head&gt; tag</p>
                <p className="text-sm text-slate-500">Log in to your website CMS and paste the code before the closing header tag.</p>
              </div>
            </div>
          </div>

          {status === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-in slide-in-from-bottom-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="text-sm font-medium">Domain Verified! The AI is now live on {domain}.</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400 italic">Having trouble? Contact info@smilestomiles.com</p>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              onClick={runVerification}
              disabled={verifying}
              className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              {verifying && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
              Check Connection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
