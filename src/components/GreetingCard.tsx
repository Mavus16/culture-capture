'use client';

import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { UploadCloud } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

interface GreetingCardProps {
  state: 'IDLE' | 'MOCK_EXPLORER_OPEN' | 'UPLOADING' | 'NEURAL_SCAN' | 'AI_ASKING' | 'REVEAL';
  onDropzoneClick: () => void;
  onMusicPillShow?: () => void;
  onCardFlip?: () => void;
}

const CARD_W = 320;
const CARD_H = Math.round(CARD_W * (7 / 5)); // 448 — 5:7

export function GreetingCard({ state, onDropzoneClick, onMusicPillShow, onCardFlip }: GreetingCardProps) {
  const hasImage = state !== 'IDLE' && state !== 'MOCK_EXPLORER_OPEN';
  const isReveal = state === 'REVEAL';
  const [showMusicPill, setShowMusicPill] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state === 'NEURAL_SCAN') {
      const t = setTimeout(() => {
        setShowMusicPill(true);
        onMusicPillShow?.();
      }, 1500);
      return () => clearTimeout(t);
    }
    if (state === 'IDLE') setShowMusicPill(false);
  }, [state, onMusicPillShow]);

  /* ─── 3D BOOK-FOLD PHYSICS ───
   *
   *  Physical model: a greeting card lying flat.
   *
   *  Container (2 × CARD_W):
   *    [0 ── CARD_W]  ←  where inside_left lands when open
   *    [CARD_W ── 2×CARD_W]  ←  StaticBase (inside_right) + MovingLeaf start
   *
   *  MovingLeaf sits at left: CARD_W, transform-origin: LEFT edge (= the spine).
   *    rotateY(0)   → front.jpg  covers StaticBase (card is CLOSED)
   *    rotateY(-180) → leaf swings left into [0, CARD_W], inside_left.jpg faces viewer
   *
   *  Result at -180°: inside_left | inside_right = flush double-page spread ✓
   */

  const leafRotation = useMotionValue(0); // 0 = closed, -180 = open
  const springRot = useSpring(leafRotation, { stiffness: 260, damping: 20 });

  // Crease shadow: 0% at 0°, 40% at -180°
  const creaseOpacity = useTransform(springRot, [0, -180], [0, 0.4]);

  // Dynamic centering: shift container left by CARD_W/2 when closed, 0 when open
  const containerX = useTransform(springRot, [0, -180], [-CARD_W / 2, 0]);

  // Click-to-flip toggle
  const handleClick = () => {
    if (isOpen) {
      animate(leafRotation, 0, { type: 'spring', stiffness: 260, damping: 20 });
      setIsOpen(false);
    } else {
      animate(leafRotation, -180, { type: 'spring', stiffness: 260, damping: 20 });
      setIsOpen(true);
      onCardFlip?.();
    }
  };

  // Pulse hint every 5 seconds when closed
  useEffect(() => {
    if (!isReveal || isOpen) return;
    let cancelled = false;
    const loop = async () => {
      while (!cancelled) {
        await new Promise(r => setTimeout(r, 5000));
        if (cancelled) break;
        await animate(leafRotation, -12, { duration: 0.6, ease: 'easeInOut' });
        if (cancelled) break;
        await animate(leafRotation, 0, { duration: 0.6, ease: 'easeInOut' });
      }
    };
    loop();
    return () => { cancelled = true; };
  }, [isReveal, isOpen, leafRotation]);

  /* ── Drag handlers ── */
  const handlePan = (_: PointerEvent, info: { delta: { x: number } }) => {
    // Dragging LEFT (negative delta) → more negative rotation (opening)
    const next = Math.max(-180, Math.min(0, leafRotation.get() + info.delta.x * 0.6));
    leafRotation.set(next);
  };

  const handlePanEnd = (_: PointerEvent, info: { velocity: { x: number } }) => {
    const cur = leafRotation.get();
    const vel = info.velocity.x;
    if (!isOpen) {
      // Opening: snap open if past -55° or fast swipe left
      if (cur < -55 || vel < -280) {
        animate(leafRotation, -180, { type: 'spring', stiffness: 260, damping: 20 });
        setIsOpen(true);
        onCardFlip?.();
      } else {
        animate(leafRotation, 0, { type: 'spring', stiffness: 260, damping: 20 });
      }
    } else {
      // Closing: snap closed if past -125° or fast swipe right
      if (cur > -125 || vel > 280) {
        animate(leafRotation, 0, { type: 'spring', stiffness: 260, damping: 20 });
        setIsOpen(false);
      } else {
        animate(leafRotation, -180, { type: 'spring', stiffness: 260, damping: 20 });
      }
    }
  };

  /* ═══════════════════════════════════════════
     PRE-REVEAL: Upload / Scan states
     ═══════════════════════════════════════════ */
  if (!isReveal) {
    return (
      <div
        style={{ width: CARD_W, height: CARD_H }}
        className={`relative rounded-[10px] flex flex-col items-center justify-center text-center overflow-hidden border border-white/20 ${
          hasImage ? 'bg-white shadow-2xl' : 'bg-white/50 hover:bg-white/80 border-dashed border-espresso/20 cursor-pointer'
        }`}
        onClick={state === 'IDLE' ? onDropzoneClick : undefined}
      >
        {hasImage ? (
          <>
            <img src="/asian_girl_lifestyle.png" alt="Memory" className="w-full h-full object-cover" />
            {state === 'NEURAL_SCAN' && (
              <div className="absolute inset-0 bg-espresso/20 backdrop-blur-sm flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-rose/30 border-t-rose rounded-full animate-spin" />
              </div>
            )}
            <AnimatePresence>
              {showMusicPill && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
                  <span className="text-[10px] text-white font-mono">🎵 Sabrina Carpenter — Espresso | ATTRIBUTE_SYNC: 98%</span>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-butter flex items-center justify-center mb-4 border border-black/5">
              <UploadCloud className="text-rose" size={28} />
            </div>
            <h3 className="text-lg font-serif text-espresso mb-2">Initialize Core</h3>
            <p className="text-xs font-mono text-espresso/60 uppercase tracking-widest">Click to bypass &amp; upload</p>
          </>
        )}
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     REVEAL: Physical Book-Fold 3D Card
     ═══════════════════════════════════════════ */
  return (
    <div className="flex flex-col items-center">

      {/* CardContainer — perspective root */}
      <div style={{ perspective: 2000, perspectiveOrigin: '50% 50%' }}>
        <motion.div style={{ width: CARD_W * 2, height: CARD_H, position: 'relative', x: containerX }}>

          {/* ── StaticBase: inside_right.jpg ──
              Always visible at [CARD_W, 2×CARD_W].
              This is the foundation that the leaf reveals when it opens. */}
          <div
            style={{
              position: 'absolute',
              left: CARD_W,
              top: 0,
              width: CARD_W,
              height: CARD_H,
            }}
            className="rounded-r-[10px] overflow-hidden shadow-xl"
          >
            <img
              src="/card_insideright.jpg"
              alt="Inside right"
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* Dynamic crease shadow — darkens on the left edge as card opens */}
            <motion.div
              style={{
                opacity: creaseOpacity,
                background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)',
              }}
              className="absolute inset-y-0 left-0 w-20 pointer-events-none"
            />
          </div>

          {/* ── MovingLeaf ──
              Positioned at [CARD_W, 2×CARD_W], same as StaticBase.
              transform-origin: LEFT edge = the spine/hinge.
              At rotateY(0): front.jpg covers StaticBase.
              At rotateY(-180): leaf swings to [0, CARD_W], inside_left.jpg faces viewer. */}
          <motion.div
            style={{
              position: 'absolute',
              left: CARD_W,
              top: 0,
              width: CARD_W,
              height: CARD_H,
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              rotateY: springRot,
              zIndex: 10,
            }}
            onClick={handleClick}
            onPan={handlePan as never}
            onPanEnd={handlePanEnd as never}
            className="cursor-pointer active:cursor-grabbing"
          >
            {/* Front Face — front.jpg */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                position: 'absolute',
                inset: 0,
              }}
              className="rounded-r-[10px] overflow-hidden shadow-2xl"
            >
              <img
                src="/card_front.jpg"
                alt="Front cover"
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Swipe hint */}
              <AnimatePresence>
                {!isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                  >
                    <motion.span
                      animate={{ x: [0, -7, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: 0.5 }}
                      className="text-2xl text-espresso/25 select-none"
                    >‹</motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Back Face — inside_left.jpg
                Inner rotateY(180deg) so the image reads correctly when leaf is at -180° */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                position: 'absolute',
                inset: 0,
                transform: 'rotateY(180deg)',
              }}
              className="rounded-l-[10px] overflow-hidden"
            >
              <img
                src="/card_insideleft.jpg"
                alt="Inside left"
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Crease shadow on inside_left right edge (near the spine) */}
              <motion.div
                style={{
                  opacity: creaseOpacity,
                  background: 'linear-gradient(to left, rgba(0,0,0,0.6), transparent)',
                }}
                className="absolute inset-y-0 right-0 w-20 pointer-events-none"
              />
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* Contextual label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-5 text-[10px] font-mono text-espresso/35 uppercase tracking-widest select-none"
      >
        {isOpen ? 'Click or Drag → to close' : 'Click or Drag ← to open'}
      </motion.p>
    </div>
  );
}
