import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, AlertTriangle, Brain, Search } from 'lucide-react';

export type AnalysisItem = {
  id: string;
  content: string;
  detectedType: string;
  riskLevel: string;
  confidence: number;
  summary: string;
  recommendation: string;
  indicators: string[];
  imageName?: string | null;
  createdAt: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: AnalysisItem[];
  loading: boolean;
}

export function AnalysisHistoryModal({ isOpen, onClose, items, loading }: Props) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selectedItem = items.find(it => it.id === selectedId);

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedId(null);
    }
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ width: '100vw', height: '100vh' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-surface-container border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
          >
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
              <h2 className="text-2xl font-bold text-on-surface">Lịch sử phân tích</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-container-highest rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* List */}
              <div className={`flex-1 md:w-1/2 border-r border-outline-variant/30 overflow-y-auto p-4 space-y-3 ${selectedItem ? 'hidden md:block' : 'block'}`}>
                {loading ? (
                  <div className="text-center py-8 text-on-surface-variant">Đang tải...</div>
                ) : items.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant flex flex-col items-center gap-3">
                    <Search className="w-12 h-12 opacity-20" />
                    <p>Bạn chưa có lịch sử phân tích.</p>
                  </div>
                ) : (
                  items.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedId === item.id ? 'bg-primary/10 border-primary/50' : 'bg-surface-container-lowest border-outline-variant/30 hover:border-primary/30'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-semibold text-primary">{item.detectedType}</span>
                        <span className="text-xs text-on-surface-variant">
                          {new Date(item.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant line-clamp-2 mb-3">{item.content}</p>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium uppercase ${
                           item.riskLevel.toLowerCase() === 'high' ? 'bg-error/20 text-error' : 
                           item.riskLevel.toLowerCase() === 'medium' ? 'bg-secondary/20 text-secondary' : 
                           'bg-success/20 text-success'
                        }`}>
                          {item.riskLevel.toLowerCase() === 'high' ? 'Nguy hiểm' : 
                           item.riskLevel.toLowerCase() === 'medium' ? 'Cảnh báo' : 'An toàn'}
                        </span>
                        <span className="text-xs font-medium opacity-70">{item.confidence}% tin cậy</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Detail */}
              {selectedItem ? (
                <div className="flex-1 md:w-1/2 overflow-y-auto p-6 bg-surface-container-lowest">
                  <button 
                    onClick={() => setSelectedId(null)} 
                    className="md:hidden mb-4 text-sm font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    &larr; Quay lại danh sách
                  </button>
                  <div className={`p-4 rounded-xl border mb-6 flex items-start gap-4 ${
                    selectedItem.riskLevel.toLowerCase() === 'high' ? 'border-error bg-error-container/20 text-error' : 
                    selectedItem.riskLevel.toLowerCase() === 'medium' ? 'border-secondary/50 bg-secondary-container/20 text-secondary' : 
                    'border-success/50 bg-success/10 text-success'
                  }`}>
                    <div className="shrink-0 mt-1">
                      {selectedItem.riskLevel.toLowerCase() === 'high' ? <AlertTriangle className="w-8 h-8" /> : 
                       <ShieldCheck className="w-8 h-8" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold uppercase mb-1">
                        {selectedItem.riskLevel.toLowerCase() === 'high' ? 'Nguy hiểm' : 
                         selectedItem.riskLevel.toLowerCase() === 'medium' ? 'Cảnh báo' : 'An toàn'}
                      </h3>
                      <p className="text-sm opacity-80">Loại: {selectedItem.detectedType} • Độ tin cậy: {selectedItem.confidence}%</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-on-surface flex items-center gap-2"><Brain className="w-4 h-4 text-primary" /> Tóm tắt</h4>
                      {selectedItem.imageName && (
                        <div className="mb-3 p-2 bg-primary/10 rounded-lg inline-flex items-center gap-2 border border-primary/20">
                          <span className="text-xs font-semibold text-primary">Ảnh đính kèm:</span>
                          <span className="text-xs text-on-surface-variant truncate max-w-[200px]">{selectedItem.imageName}</span>
                        </div>
                      )}
                      <p className="text-sm text-on-surface-variant leading-relaxed">{selectedItem.summary}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-on-surface flex items-center gap-2"><Search className="w-4 h-4 text-primary" /> Dấu hiệu nhận biết</h4>
                      <ul className="space-y-2">
                        {selectedItem.indicators.map((indicator, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-on-surface-variant">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Khuyến nghị</h4>
                      <p className="text-sm text-primary leading-relaxed">{selectedItem.recommendation}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex flex-1 items-center justify-center p-6 text-on-surface-variant opacity-50 bg-surface-container-lowest">
                  <div className="text-center">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-3" />
                    <p>Chọn một bản ghi để xem chi tiết</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return null;
}
