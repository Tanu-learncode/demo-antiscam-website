import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, LogIn, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function LoginPromptModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Yêu cầu đăng nhập',
  message = 'Vui lòng đăng nhập để sử dụng tính năng này.',
}: LoginPromptModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm z-10"
          >
            <GlassCard className="p-6 overflow-hidden flex flex-col items-center text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                <Lock className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-bold text-on-surface mb-2">{title}</h3>
              <p className="text-sm text-on-surface-variant mb-8">
                {message}
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-outline-variant rounded-xl text-on-surface font-medium hover:bg-surface-container-highest transition-colors"
                >
                  Để sau
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onConfirm();
                  }}
                  className="flex-1 py-3 px-4 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
