/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, KeyboardEvent } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Link as LinkIcon, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Search
} from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!url.trim()) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      let formattedUrl = url;
      if (!/^https?:\/\//i.test(url)) {
        formattedUrl = `https://${url}`;
      }
      setGeneratedUrl(formattedUrl);
      setIsGenerating(false);
    }, 600);
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `QR-Rapid-${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans text-gray-900 selection:bg-blue-100 overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 md:px-8 py-4 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">QR Rapid</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
          <a href="#" className="text-blue-600 border-b-2 border-blue-600 pb-1">Generator</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Documentation</a>
        </div>
        <button className="md:hidden p-2 text-gray-400">
          <Search className="w-5 h-5" />
        </button>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden relative">
        
        {/* Left Pane: Input */}
        <section className="w-full md:w-1/2 p-6 sm:p-10 md:p-16 flex flex-col justify-center bg-white relative z-10 min-h-[50vh] md:min-h-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md mx-auto md:mx-0 w-full"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
              Instant Generation
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-6 md:mb-8 leading-[1.1]">
              Enter a URL to create <br/>
              <span className="font-bold block mt-1">Your Own QR Code.</span>
            </h1>
            
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destination link</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="https://www.example.com"
                    className="w-full px-5 py-4 sm:px-6 sm:py-5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-base sm:text-lg placeholder:text-gray-300"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors">
                    <LinkIcon className="w-5 h-5 sm:w-6 h-6" />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={!url || isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white font-bold py-4 sm:py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all text-base sm:text-lg flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {isGenerating ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Generate QR Code <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="pt-8 md:pt-10 border-t border-gray-100">
                <div className="flex gap-4 items-start">
                  <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed max-w-[280px]">
                    Generated QR codes are persistent and can be modified or exported in high resolution at any time. No tracking, only utility.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Right Pane: Preview */}
        <section className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 relative overflow-hidden p-8 sm:p-12 min-h-[50vh] md:min-h-0">
          {/* Backdrops */}
          <div className="absolute top-1/4 right-10 w-48 h-48 bg-blue-200 rounded-full blur-[100px] opacity-30 animate-pulse" />
          <div className="absolute bottom-1/4 left-10 w-64 h-64 bg-indigo-200 rounded-full blur-[120px] opacity-20" />

          <AnimatePresence mode="wait">
            {!generatedUrl ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-6 relative z-10"
              >
                <div className="w-32 h-32 sm:w-48 sm:h-48 border-4 border-dashed border-gray-200 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center bg-white/50 backdrop-blur-sm">
                  <Zap className="w-8 h-8 sm:w-12 h-12 text-gray-200" />
                </div>
                <p className="text-gray-400 text-sm font-medium tracking-wide">Waiting for your URL...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="flex flex-col items-center relative z-10 w-full max-w-sm"
              >
                <div className="bg-white p-8 sm:p-10 md:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_48px_80px_-16px_rgba(0,0,0,0.12)] border border-white flex flex-col items-center w-full">
                  <div 
                    ref={qrRef}
                    className="w-full aspect-square border-[6px] sm:border-8 border-gray-50 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center p-3 sm:p-4 bg-white"
                  >
                    <QRCodeCanvas
                      value={generatedUrl}
                      size={240}
                      level="H"
                      className="image-render-pixel w-full h-full"
                    />
                  </div>
                  
                  <div className="mt-8 sm:mt-10 flex flex-col gap-3 w-full">
                    <button 
                      onClick={downloadQRCode}
                      className="w-full py-3.5 sm:py-4 bg-gray-900 text-white rounded-full text-sm font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                    >
                      <Download className="w-4 h-4" /> Download PNG
                    </button>
                    <a 
                      href={generatedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 sm:py-4 bg-white border border-gray-200 text-gray-900 rounded-full text-sm font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                       <ExternalLink className="w-4 h-4 text-gray-400" /> View Link
                    </a>
                  </div>
                </div>

                <div className="mt-8 sm:mt-10 text-center space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Ready to scan</p>
                  <div className="flex justify-center items-center gap-2 text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Active Result</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white px-8 py-4 flex flex-col md:flex-row justify-between items-center border-t border-gray-100 relative z-20">
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 md:mb-0">
          © {new Date().getFullYear()} QuickQR Generator. All rights reserved.
        </div>
        <div className="flex gap-6 items-center">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Minimalist Design</span>
          <div className="h-4 w-px bg-gray-100 hidden md:block"></div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No Tracking</span>
        </div>
      </footer>
    </div>
  );
}

