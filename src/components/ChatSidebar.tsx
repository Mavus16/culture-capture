'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Sparkles, Terminal } from 'lucide-react';

interface ChatSidebarProps {
  state: 'IDLE' | 'MOCK_EXPLORER_OPEN' | 'UPLOADING' | 'NEURAL_SCAN' | 'AI_ASKING' | 'REVEAL';
  onScanComplete: () => void;
  onChoiceSelect: (tone: string) => void;
}

const TypewriterText = ({ text, onComplete, speed = 40 }: { text: string; onComplete?: () => void; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return <span>{displayedText}</span>;
};

export function ChatSidebar({ state, onScanComplete, onChoiceSelect }: ChatSidebarProps) {
  const [activeStep, setActiveStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === 'NEURAL_SCAN') setActiveStep(1);
    if (state === 'IDLE') setActiveStep(0);
    if (state === 'REVEAL') setActiveStep(7);
  }, [state]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [activeStep]);

  const handleQ1Select = () => setActiveStep(3);
  const handleQ2Select = () => setActiveStep(5);
  const handleQ3Select = () => {
    setActiveStep(7);
    setTimeout(() => onChoiceSelect('Heartfelt'), 1000);
  };

  return (
    <div className="w-80 h-full bg-[#202020] border-l border-white/5 flex flex-col p-6 shadow-2xl relative z-20 font-mono text-white/90">
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4 shrink-0">
        <Terminal className="text-rose" size={18} />
        <h2 className="font-semibold tracking-wider text-sm">Neural Bridge</h2>
      </div>

      <div ref={scrollRef} className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 text-xs pb-10 scroll-smooth">
        <AnimatePresence>
          {activeStep === 0 && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="text-white/30 flex flex-col items-center justify-center h-full gap-3 text-center">
              <p className="animate-pulse">_ Awaiting visual input</p>
            </motion.div>
          )}

          {/* QUESTION 1 */}
          {activeStep >= 1 && (
            <motion.div
              key="q1"
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              className="bg-black/20 rounded-md p-4 border border-white/5 shrink-0"
            >
              <div className="font-semibold text-rose mb-2 flex items-center gap-1.5 uppercase text-[10px]">
                <div className="w-1.5 h-1.5 rounded-full bg-rose animate-pulse" />
                Aesthetic Sync
              </div>
              <p className="leading-relaxed text-white/80">
                <TypewriterText 
                  text="Detected 'Short n' Sweet' visual DNA. Should we proceed with [Espresso Retro] or pivot to [Nocturnal Noir]?" 
                  onComplete={activeStep === 1 ? () => setTimeout(() => setActiveStep(2), 500) : undefined} 
                />
              </p>
            </motion.div>
          )}
          {activeStep >= 2 && activeStep < 3 && (
            <motion.div key="a1" initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, scale: 0.95, height: 0, margin: 0 }} className="flex flex-col gap-2 shrink-0">
              <button onClick={handleQ1Select} className="w-full py-2.5 px-4 bg-white text-charcoal text-xs font-semibold rounded-full hover:bg-white/90 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse outline-none border-2 border-transparent">
                [Espresso Retro]
              </button>
              <button onClick={handleQ1Select} className="w-full py-2.5 px-4 bg-transparent text-white/50 text-xs font-medium rounded-full border border-white/10 hover:bg-white/5 transition-colors outline-none">
                [Nocturnal Noir]
              </button>
            </motion.div>
          )}

          {/* QUESTION 2 */}
          {activeStep >= 3 && (
            <motion.div
              key="q2"
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              className="bg-black/20 rounded-md p-4 border border-white/5 shrink-0"
            >
              <p className="leading-relaxed text-white/80">
                <TypewriterText 
                  text="Vibe locked. Who is this memory for?" 
                  onComplete={activeStep === 3 ? () => setTimeout(() => setActiveStep(4), 500) : undefined} 
                />
              </p>
            </motion.div>
          )}
          {activeStep >= 4 && activeStep < 5 && (
            <motion.div key="a2" initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, scale: 0.95, height: 0, margin: 0 }} className="flex flex-col gap-2 shrink-0">
              <button onClick={handleQ2Select} className="w-full py-2.5 px-4 bg-white text-charcoal text-xs font-semibold rounded-full hover:bg-white/90 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse outline-none border-2 border-transparent">
                [Partner]
              </button>
              <button onClick={handleQ2Select} className="w-full py-2.5 px-4 bg-transparent text-white/50 text-xs font-medium rounded-full border border-white/10 hover:bg-white/5 transition-colors outline-none">
                [Best Friend]
              </button>
              <button onClick={handleQ2Select} className="w-full py-2.5 px-4 bg-transparent text-white/50 text-xs font-medium rounded-full border border-white/10 hover:bg-white/5 transition-colors outline-none">
                [Family]
              </button>
            </motion.div>
          )}

          {/* QUESTION 3 */}
          {activeStep >= 5 && (
            <motion.div
              key="q3"
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              className="bg-black/20 rounded-md p-4 border border-white/5 shrink-0"
            >
              <p className="leading-relaxed text-white/80">
                <TypewriterText 
                  text="Finalizing the soul of the card. Should the message be [Heartfelt] or [Witty]?" 
                  onComplete={activeStep === 5 ? () => setTimeout(() => setActiveStep(6), 500) : undefined} 
                />
              </p>
            </motion.div>
          )}
          {activeStep >= 6 && activeStep < 7 && (
            <motion.div key="a3" initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, scale: 0.95, height: 0, margin: 0 }} className="flex flex-col gap-2 shrink-0">
              <button onClick={handleQ3Select} className="w-full py-2.5 px-4 bg-white text-charcoal text-xs font-semibold rounded-full hover:bg-white/90 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] animate-pulse outline-none border-2 border-transparent">
                [Heartfelt]
              </button>
              <button onClick={handleQ3Select} className="w-full py-2.5 px-4 bg-transparent text-white/50 text-xs font-medium rounded-full border border-white/10 hover:bg-white/5 transition-colors outline-none">
                [Witty]
              </button>
            </motion.div>
          )}

          {/* REVEAL */}
          {activeStep >= 7 && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              className="bg-green-500/10 rounded-md p-4 border border-green-500/20 mt-4 text-center uppercase tracking-widest text-[10px] shrink-0 text-green-400"
            >
              <p className="font-semibold">
                Construct Compiled
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HUD Logs at bottom */}
      <div className="pt-4 border-t border-white/10 shrink-0 text-[9px] uppercase tracking-widest text-white/40 flex flex-col gap-1.5 opacity-80">
        <div className="flex justify-between">
          <span>VECTOR_DB:</span>
          <span className="text-white/80">DISTANCE 0.04</span>
        </div>
        <div className="flex justify-between">
          <span>VLM_CONFIDENCE:</span>
          <span className="text-rose">98%</span>
        </div>
        <div className="flex justify-between">
          <span>LLM_ROUTER:</span>
          <span className="text-white/80">GPT-4-TURBO</span>
        </div>
      </div>
    </div>
  );
}
