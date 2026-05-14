'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const LOG_LINES = [
  '> [SCAN] INGESTING MEDIA_STREAM... SOURCE: INSTAGRAM_STORY_CAPTURE.',
  '> [AUDIO] OCR_FINGERPRINT: "ESPRESSO" BY SABRINA CARPENTER DETECTED.',
  '> [DB] FETCHING ARTIST_EMBEDDINGS: [██████████] 100% (CACHED).',
  "> [GEN] DETECTED 'SHORT N' SWEET' VISUAL DNA. MAPPING SEMANTICS...",
  '> [3D] PROCEEDING WITH [ESPRESSO RETRO] MESH HYDRATION...',
];

interface DynamicTerminalProps {
  state: 'IDLE' | 'MOCK_EXPLORER_OPEN' | 'UPLOADING' | 'NEURAL_SCAN' | 'AI_ASKING' | 'REVEAL';
  musicPillVisible: boolean;
  cardFlipped: boolean;
}

export function DynamicTerminal({ state, musicPillVisible, cardFlipped }: DynamicTerminalProps) {
  const [lines, setLines] = useState<string[]>([]);

  // Log 1: Triggered on initial mount (UPLOADING state)
  useEffect(() => {
    if (state === 'UPLOADING' || state === 'NEURAL_SCAN' || state === 'AI_ASKING' || state === 'REVEAL') {
      setLines(prev => {
        if (!prev.includes(LOG_LINES[0])) return [...prev, LOG_LINES[0]];
        return prev;
      });
    }
  }, [state]);

  // Logs 2 & 3: Triggered when Instagram Pill animates in
  useEffect(() => {
    if (musicPillVisible) {
      const t1 = setTimeout(() => {
        setLines(prev => {
          if (!prev.includes(LOG_LINES[1])) return [...prev, LOG_LINES[1]];
          return prev;
        });
      }, 400);
      const t2 = setTimeout(() => {
        setLines(prev => {
          if (!prev.includes(LOG_LINES[2])) return [...prev, LOG_LINES[2]];
          return prev;
        });
      }, 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [musicPillVisible]);

  // Log 4: Triggered when Right Pane HUD shows "Short n' Sweet" (AI_ASKING state)
  useEffect(() => {
    if (state === 'AI_ASKING') {
      const t = setTimeout(() => {
        setLines(prev => {
          if (!prev.includes(LOG_LINES[3])) return [...prev, LOG_LINES[3]];
          return prev;
        });
      }, 600);
      return () => clearTimeout(t);
    }
  }, [state]);

  // Log 5: Triggered when user clicks/swipes to flip the card
  useEffect(() => {
    if (cardFlipped) {
      setLines(prev => {
        if (!prev.includes(LOG_LINES[4])) return [...prev, LOG_LINES[4]];
        return prev;
      });
    }
  }, [cardFlipped]);

  if (lines.length === 0) return null;

  return (
    <>
      {/* Desktop: fixed bottom-center */}
      <div className="hidden lg:block fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[700px] pointer-events-none">
        <div className="flex flex-col items-center gap-1.5">
          {lines.map((line) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] font-mono text-espresso/70 text-center whitespace-nowrap"
            >
              {line}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: inline block rendered via portal-style prop */}
      <div className="lg:hidden w-full h-24 overflow-y-auto z-40 px-4 py-2 shrink-0">
        <div className="flex flex-col items-center gap-1">
          {lines.map((line) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-[9px] font-mono text-espresso/70 text-center"
            >
              {line}
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
