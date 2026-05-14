'use client';

import { useState, useCallback } from 'react';
import { FileExplorer } from '@/components/FileExplorer';
import { GreetingCard } from '@/components/GreetingCard';
import { ChatSidebar } from '@/components/ChatSidebar';
import { DynamicTerminal } from '@/components/DynamicTerminal';
import { motion, AnimatePresence } from 'framer-motion';

type State = 'IDLE' | 'MOCK_EXPLORER_OPEN' | 'UPLOADING' | 'NEURAL_SCAN' | 'AI_ASKING' | 'REVEAL';

export default function Home() {
  const [state, setState] = useState<State>('IDLE');
  const [musicPillVisible, setMusicPillVisible] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);

  const handleDropzoneClick = () => {
    setState('MOCK_EXPLORER_OPEN');
  };

  const handleSelectImage = () => {
    setState('UPLOADING');
    setTimeout(() => {
      setState('NEURAL_SCAN');
    }, 400);
  };

  const handleScanComplete = () => {
    setState('AI_ASKING');
  };

  const handleChoiceSelect = () => {
    setState('REVEAL');
  };

  const handleMusicPillShow = useCallback(() => {
    setMusicPillVisible(true);
  }, []);

  const handleCardFlip = useCallback(() => {
    setCardFlipped(true);
  }, []);

  // Show terminal from UPLOADING onwards
  const showTerminal = state === 'UPLOADING' || state === 'NEURAL_SCAN' || state === 'AI_ASKING' || state === 'REVEAL';

  return (
    <main className="flex h-screen w-full bg-butter overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-rose/5 blur-[150px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-espresso/5 blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <AnimatePresence>
          {state === 'IDLE' && (
            <motion.div
              key="idle-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-12 text-center"
            >
              <h1 className="text-3xl font-serif text-espresso mb-2 tracking-tight">Culture Capture</h1>
              <p className="text-espresso/60 text-xs font-mono uppercase tracking-widest">Neural Design Engine</p>
            </motion.div>
          )}
        </AnimatePresence>

        <GreetingCard
          state={state}
          onDropzoneClick={handleDropzoneClick}
          onMusicPillShow={handleMusicPillShow}
          onCardFlip={handleCardFlip}
        />
      </div>

      {/* Intelligence Bridge Sidebar */}
      <motion.div
        initial={{ x: 320 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, delay: 0.2 }}
        className="h-full z-20"
      >
        <ChatSidebar
          state={state}
          onScanComplete={handleScanComplete}
          onChoiceSelect={handleChoiceSelect}
        />
      </motion.div>

      {/* Overlays */}
      <FileExplorer
        isOpen={state === 'MOCK_EXPLORER_OPEN'}
        onClose={() => setState('IDLE')}
        onSelectImage={handleSelectImage}
      />

      {showTerminal && (
        <DynamicTerminal
          state={state}
          musicPillVisible={musicPillVisible}
          cardFlipped={cardFlipped}
        />
      )}
    </main>
  );
}
