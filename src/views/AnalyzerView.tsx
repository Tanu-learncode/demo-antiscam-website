"use client";
import { ArrowRight, Brain, Database, Image as ImageIcon, LineChart, Search, ShieldCheck, Globe, Mail, MessageSquare, Phone, CreditCard, Link, AlertTriangle, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/ui/GlassCard';
import { AnalysisHistoryModal, type AnalysisItem } from '../components/ui/AnalysisHistoryModal';
import { LoginPromptModal } from '../components/ui/LoginPromptModal';

export function AnalyzerView({ onViewChange }: { onViewChange?: (view: any) => void }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; name: string; previewUrl: string } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<AnalysisItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (mounted && data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const handleOpenHistory = async () => {
    setIsModalOpen(true);
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/history?limit=100', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setHistoryItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const base64Data = result.split(',')[1];
      
      setSelectedImage({
        data: base64Data,
        mimeType: file.type,
        name: file.name,
        previewUrl: result
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAnalyze = async () => {
    if (!content.trim() && !selectedImage) return;

    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    
    setIsAnalyzing(true);
    setLoadingStep(0);
    setAnalysisResult(null);
    setErrorMessage('');
    
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 2 ? prev + 1 : prev));
    }, 800);
    
    try {
      const payload: any = { content };
      if (selectedImage) {
        payload.image = {
          data: selectedImage.data,
          mimeType: selectedImage.mimeType
        };
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (res.ok && data.ok && data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        setErrorMessage(data.message || 'Có lỗi xảy ra khi phân tích.');
      }
    } catch (error) {
        setErrorMessage('Không thể kết nối đến máy chủ.');
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-16">
      <AnalysisHistoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        items={historyItems} 
        loading={historyLoading} 
      />
      {/* Hero */}
      <section className="text-center space-y-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary/20 text-primary mb-4"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest">AI Protection v4.2</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl mx-auto leading-tight"
        >
          Hệ Thống Phân Tích Đa Tầng
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-on-surface-variant max-w-2xl mx-auto"
        >
          Sử dụng mô hình ngôn ngữ lớn (LLM) và nhận diện hình ảnh thông minh để phát hiện các dấu hiệu lừa đảo, giả mạo chỉ trong vài giây.
        </motion.p>
      </section>

      {/* Main Analyzer Tool */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        className="max-w-4xl mx-auto"
      >
        <GlassCard glow="primary" className="p-6 relative overflow-hidden">
          {isAnalyzing && (
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-y z-50"></div>
          )}
          <div className="space-y-6 relative z-20">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                <Search className="w-4 h-4" />
                NHẬP NỘI DUNG HOẶC TẢI ẢNH NGHI VẤN
              </label>
              
              {selectedImage && (
                <div className="relative p-4 bg-surface-container-lowest border border-primary/50 rounded-lg flex items-start gap-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-black/50 shrink-0 border border-outline-variant/30">
                    <img src={selectedImage.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 truncate">
                    <span className="text-sm font-semibold text-primary truncate">{selectedImage.name}</span>
                    <span className="text-xs text-on-surface-variant">Ảnh đã tải lên sẵn sàng phân tích</span>
                    <div className="flex items-center gap-3 mt-2">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isAnalyzing}
                        className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                      >
                        Đổi ảnh
                      </button>
                      <button 
                        onClick={() => setSelectedImage(null)}
                        disabled={isAnalyzing}
                        className="text-xs font-medium text-error hover:underline disabled:opacity-50"
                      >
                        Xóa ảnh
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <textarea 
                className={`w-full h-32 bg-surface-container-lowest border focus:ring-1 rounded-lg p-4 text-on-surface placeholder:text-outline transition-all resize-none ${isAnalyzing ? 'border-primary/50 opacity-50 cursor-not-allowed' : 'border-outline-variant focus:border-primary focus:ring-primary'}`}
                placeholder="Dán nội dung tin nhắn, đường dẫn URL, hoặc chú thích thêm cho ảnh tại đây..."
                disabled={isAnalyzing}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept=".jpg,.jpeg,.png,.webp" 
                className="hidden" 
              />
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs text-on-surface-variant font-medium">Ví dụ nhanh:</span>
                {[
                  { label: 'Website giả mạo', text: 'http://vcb-bank-update.com/login' },
                  { label: 'Email phishing', text: 'Cảnh báo: Tài khoản của bạn sẽ bị khóa trong 24h. Click vào link dưới để xác thực.' },
                  { label: 'Tin nhắn trúng thưởng', text: 'Chuc mung ban da trung thuong 1 xe SH. Vui long chuyen khoan 2 trieu phi lam ho so vao STK 123456.' },
                  { label: 'SMS ngân hàng', text: 'Sacombank: Tai khoan cua ban dang tieu dung tai nuoc ngoai. Bam vao s-bank.vip de huy.' }
                ].map((ex, i) => (
                  <motion.button 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                    onClick={() => setContent(ex.text)}
                    disabled={isAnalyzing}
                    className="px-3 py-1.5 text-xs bg-surface-container/50 hover:bg-primary/20 text-on-surface hover:text-primary rounded-full transition-colors border border-outline-variant/50 hover:border-primary/30 disabled:opacity-50"
                  >
                    {ex.label}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
              <motion.button 
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 p-4 bg-surface-container/50 border border-outline-variant rounded-lg hover:border-primary transition-colors text-left" 
                disabled={isAnalyzing}
              >
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface text-sm">Tải ảnh màn hình</span>
                  <span className="text-xs text-outline">Phân tích AI qua hình ảnh</span>
                </div>
              </motion.button>
              
              <motion.button 
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                onClick={handleOpenHistory}
                className="flex items-center gap-3 p-4 bg-surface-container/50 border border-outline-variant rounded-lg hover:border-primary transition-colors text-left" 
                disabled={isAnalyzing}
              >
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
                  <LineChart className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface text-sm">Lịch sử phân tích</span>
                  <span className="text-xs text-outline">Xem lại các báo cáo trước đó</span>
                </div>
              </motion.button>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(var(--color-primary), 0.5)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!content.trim() && !selectedImage)}
              className="w-full py-4 bg-primary text-on-primary font-bold text-lg rounded-xl flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none mt-4"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-6 h-6" />
                  Phân Tích Ngay
                </>
              )}
            </motion.button>
            
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
                className="mt-8 p-8 bg-surface-container/30 border border-primary/20 rounded-xl flex flex-col items-center justify-center space-y-5"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                  <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                </div>
                <h3 className="font-bold text-xl text-primary">Gemini AI đang phân tích...</h3>
                <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: "0%" }} 
                    animate={{ width: loadingStep === 0 ? "33%" : loadingStep === 1 ? "66%" : "95%" }} 
                    transition={{ duration: 0.5 }}
                    className="absolute top-0 left-0 h-full bg-primary"
                  />
                </div>
                <p className="text-sm text-primary/80 animate-pulse font-medium">
                  {loadingStep === 0 ? 'Đang kiểm tra dữ liệu...' : loadingStep === 1 ? 'Đang đối chiếu mẫu lừa đảo...' : 'Đang đánh giá mức độ rủi ro...'}
                </p>
              </motion.div>
            )}

            {errorMessage && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                 className="mt-4 p-4 border border-error bg-error-container/20 rounded-lg flex items-start gap-3"
               >
                 <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                 <p className="text-error font-semibold">{errorMessage}</p>
               </motion.div>
            )}
            
            {!isAnalyzing && analysisResult && (
               <motion.div 
                 initial="hidden" animate="visible"
                 variants={{
                   visible: { transition: { staggerChildren: 0.15 } }
                 }}
                 className="mt-8 space-y-4 text-left"
               >
                 <motion.div 
                   variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                   className={`p-5 border rounded-xl flex items-start gap-4 ${
                   analysisResult.riskLevel.toLowerCase() === 'high' ? 'border-error bg-error-container/20' : 
                   analysisResult.riskLevel.toLowerCase() === 'medium' ? 'border-secondary/50 bg-secondary-container/20 text-secondary' : 
                   'border-success/50 bg-success/10'
                 }`}>
                   <div className="shrink-0 mt-1">
                     {analysisResult.riskLevel.toLowerCase() === 'high' ? <AlertTriangle className="w-8 h-8 text-error" /> : 
                      analysisResult.riskLevel.toLowerCase() === 'medium' ? <ShieldCheck className="w-8 h-8 text-secondary" /> : 
                      <ShieldCheck className="w-8 h-8 text-success" />}
                   </div>
                   <div>
                     <h3 className={`text-xl font-bold flex items-center gap-2 mb-1 ${
                       analysisResult.riskLevel.toLowerCase() === 'high' ? 'text-error' : 
                       analysisResult.riskLevel.toLowerCase() === 'medium' ? 'text-secondary' : 
                       'text-success'
                     }`}>
                       Mức độ rủi ro: <span className="uppercase">
                         {analysisResult.riskLevel.toLowerCase() === 'high' ? 'Nguy hiểm' : 
                          analysisResult.riskLevel.toLowerCase() === 'medium' ? 'Cảnh báo' : 
                          'An toàn'}
                       </span>
                     </h3>
                     <p className="text-sm opacity-80 flex items-center gap-2">
                       <span>Độ tin cậy AI: <strong>{analysisResult.confidence}%</strong></span>
                       <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                       <span>Loại: <strong>{analysisResult.detectedType}</strong></span>
                     </p>
                   </div>
                 </motion.div>
                 
                 <motion.div 
                   variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                   className="p-5 bg-surface-container/50 border border-outline-variant/50 rounded-xl"
                 >
                   <h4 className="font-semibold mb-2 text-on-surface flex items-center gap-2"><Brain className="w-4 h-4 text-primary" /> Tóm tắt phân tích</h4>
                   <p className="text-sm text-on-surface-variant leading-relaxed">{analysisResult.summary}</p>
                 </motion.div>
                 
                 <motion.div 
                   variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                   className="p-5 bg-surface-container/50 border border-outline-variant/50 rounded-xl"
                 >
                   <h4 className="font-semibold mb-3 text-on-surface flex items-center gap-2"><Search className="w-4 h-4 text-primary" /> Dấu hiệu nhận biết</h4>
                   <ul className="space-y-2">
                     {analysisResult.indicators.map((indicator: string, idx: number) => (
                       <li key={idx} className="flex items-start gap-2 text-sm text-on-surface-variant">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                         {indicator}
                       </li>
                     ))}
                   </ul>
                 </motion.div>
                 
                 <motion.div 
                   variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                   className="p-5 bg-primary-container/10 border border-primary/30 rounded-xl"
                 >
                   <h4 className="font-semibold text-primary mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Khuyến nghị hành động</h4>
                   <p className="text-sm text-primary leading-relaxed">{analysisResult.recommendation}</p>
                 </motion.div>
               </motion.div>
            )}
          </div>
        </GlassCard>
      </motion.section>

      {/* 3 Steps */}
      <section className="space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-primary mb-2">Quy Trình Bảo Vệ 3 Bước</h2>
          <p className="text-on-surface-variant text-sm">Hệ thống phân tích tự động, trả kết quả ngay lập tức.</p>
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-primary/10 via-primary/50 to-error/30 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              { step: '01', title: 'Thu thập dữ liệu', desc: 'Trích xuất văn bản, siêu dữ liệu', icon: Database, color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/30' },
              { step: '02', title: 'Xử lý bằng AI', desc: 'Đối chiếu và phân tích ngôn ngữ', icon: Brain, color: 'text-secondary', bg: 'bg-secondary/20', border: 'border-secondary/30' },
              { step: '03', title: 'Kết luận rủi ro', desc: 'Đưa ra xác suất lừa đảo & khuyến nghị', icon: ShieldCheck, color: 'text-error', bg: 'bg-error/20', border: 'border-error/30' }
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
                className="h-full"
              >
                <GlassCard className={`p-6 border ${s.border} flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-lg transition-all duration-300 h-full relative overflow-hidden bg-surface-container/90 backdrop-blur-xl`}>
                  <div className={`w-16 h-16 rounded-2xl ${s.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_currentColor] ${s.color}`}>
                    <s.icon className={`w-8 h-8`} />
                  </div>
                  <div className={`${s.color} font-black text-sm mb-2 tracking-widest opacity-80`}>BƯỚC {s.step}</div>
                  <h3 className="text-lg font-bold mb-2 text-on-surface">{s.title}</h3>
                  <p className="text-sm text-on-surface-variant">{s.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Hỗ trợ phân tích */}
      <section className="space-y-12 pb-10 pt-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">AI hỗ trợ phân tích</h2>
          <p className="text-on-surface-variant text-lg">Hệ thống có thể phát hiện lừa đảo qua nhiều kênh thông tin khác nhau.</p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'URL', icon: Globe },
            { title: 'Email', icon: Mail },
            { title: 'Tin nhắn', icon: MessageSquare },
            { title: 'Hình ảnh', icon: ImageIcon },
            { title: 'Số điện thoại', icon: Phone },
            { title: 'Tài khoản NH', icon: CreditCard }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
              className="h-full"
            >
              <GlassCard className="p-5 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:border-primary/50 transition-all duration-300 cursor-default group h-full bg-surface-container/50">
                <item.icon className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors" />
                <span className="font-semibold text-sm text-on-surface-variant group-hover:text-primary transition-colors">{item.title}</span>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
        onConfirm={() => { if (onViewChange) onViewChange('login'); }}
        message="Vui lòng đăng nhập để sử dụng tính năng Kiểm tra AI."
      />
    </div>
  );
}
