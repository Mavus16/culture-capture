'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon } from 'lucide-react';

interface FileExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: () => void;
}

export function FileExplorer({ isOpen, onClose, onSelectImage }: FileExplorerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl overflow-hidden bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 bg-white/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-4 text-sm font-medium text-espresso/60">Gallery</span>
              </div>
              <button onClick={onClose} className="p-1 rounded-md hover:bg-black/5 text-espresso/40 hover:text-espresso transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSelectImage}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all ring-1 ring-black/5 hover:ring-rose/50"
                >
                  <img
                    src="/asian_girl_lifestyle.png"
                    alt="Lifestyle"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-medium truncate drop-shadow-md">lifestyle_memory.png</span>
                  </div>
                </motion.div>

                {/* Dummy items */}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-black/5 flex items-center justify-center border border-black/5">
                    <ImageIcon className="text-espresso/20" size={24} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
