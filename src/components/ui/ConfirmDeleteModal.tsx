import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, isDeleting }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isDeleting ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-surface-container border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden p-6 text-center"
          >
            <div className="mx-auto w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h2 className="text-2xl font-bold text-on-surface mb-2">Xác nhận xóa bài viết</h2>
            <p className="text-on-surface-variant mb-6 text-sm">
              Bạn có chắc chắn muốn xóa bài viết này không? Sau khi xóa, bài viết sẽ bị xóa khỏi hệ thống và không thể khôi phục.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="px-6 py-2 bg-surface-container-highest hover:bg-surface-container-highest/80 text-on-surface font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-error hover:brightness-110 text-white font-semibold rounded-lg transition-colors min-w-[140px] disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  'Xóa bài viết'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
