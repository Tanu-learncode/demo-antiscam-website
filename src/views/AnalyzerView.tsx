"use client";
import { ArrowRight, Brain, Database, Image as ImageIcon, LineChart, Search, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';

export function AnalyzerView() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2500);
  };

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-16">
      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary/20 text-primary mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest">AI Protection v4.2</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl mx-auto leading-tight">
          Hệ Thống Phân Tích Đa Tầng
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
          Sử dụng mô hình ngôn ngữ lớn (LLM) và nhận diện hình ảnh thông minh để phát hiện các dấu hiệu lừa đảo, giả mạo chỉ trong vài giây.
        </p>
      </section>

      {/* Main Analyzer Tool */}
      <section className="max-w-4xl mx-auto">
        <GlassCard glow="primary" className="p-6 relative overflow-hidden">
          {isAnalyzing && (
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-y z-50"></div>
          )}
          <div className="space-y-6 relative z-20">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
                <Search className="w-4 h-4" />
                NHẬP NỘI DUNG NGHI VẤN (URL, TIN NHẮN, EMAIL)
              </label>
              <textarea 
                className="w-full h-40 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-4 text-on-surface placeholder:text-outline transition-all resize-none" 
                placeholder="Dán nội dung tin nhắn hoặc đường dẫn URL tại đây để bắt đầu phân tích..."
                disabled={isAnalyzing}
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center gap-3 p-4 bg-surface-container/50 border border-outline-variant rounded-lg hover:border-primary transition-colors text-left" disabled={isAnalyzing}>
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface text-sm">Tải ảnh màn hình</span>
                  <span className="text-xs text-outline">Phân tích OCR nội dung hình ảnh</span>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 bg-surface-container/50 border border-outline-variant rounded-lg hover:border-primary transition-colors text-left" disabled={isAnalyzing}>
                <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
                  <LineChart className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface text-sm">Lịch sử phân tích</span>
                  <span className="text-xs text-outline">Xem lại các báo cáo trước đó</span>
                </div>
              </button>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-4 bg-primary text-on-primary font-bold text-lg rounded-lg flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <ShieldCheck className={`w-6 h-6 ${isAnalyzing ? 'animate-pulse' : ''}`} />
              {isAnalyzing ? 'Đang phân tích...' : 'Phân Tích Ngay'}
            </button>
            
            {showResult && (
               <div className="mt-4 p-4 border border-error bg-error-container/20 rounded-lg animate-in slide-in-from-top-4">
                 <p className="text-error font-semibold">Phân tích hoàn tất: Phát hiện rủi ro cao. Vui lòng không truy cập liên kết.</p>
               </div>
            )}
          </div>
        </GlassCard>
      </section>

      {/* 3 Steps */}
      <section className="space-y-12">
        <h2 className="text-2xl font-semibold text-center text-primary">Quy Trình Bảo Vệ 3 Bước</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Thu thập dữ liệu', desc: 'Hệ thống trích xuất văn bản, siêu dữ liệu và mã độc tiềm ẩn.', icon: Database, color: 'primary' },
            { step: '02', title: 'Xử lý bằng AI', desc: 'Đối chiếu với kho dữ liệu và phân tích ngôn ngữ thao túng tâm lý.', icon: Brain, color: 'secondary' },
            { step: '03', title: 'Kết luận rủi ro', desc: 'Trả về xác suất lừa đảo kèm khuyến nghị hành động cụ thể.', icon: ShieldCheck, color: 'error' }
          ].map((s) => (
            <GlassCard key={s.step} className={`p-6 border-t-2 border-t-${s.color}/50 flex flex-col items-center text-center group`}>
              <div className={`w-16 h-16 rounded-full bg-${s.color}/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <s.icon className={`w-8 h-8 text-${s.color}`} />
              </div>
              <div className={`text-${s.color} font-bold text-sm mb-2 uppercase`}>BƯỚC {s.step}</div>
              <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
              <p className="text-sm text-on-surface-variant">{s.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Case Study */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <GlassCard className="lg:col-span-8 p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden border border-white/5">
               <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500&q=80" alt="Cyber" className="w-full h-full object-cover" />
            </div>
            <div className="md:w-2/3 space-y-4">
              <span className="inline-block px-3 py-1 rounded bg-error-container text-on-error-container text-xs font-bold">CA LỪA ĐẢO MỚI</span>
              <h4 className="text-xl font-semibold">Giả mạo App Ngân hàng VCB qua iMessage</h4>
              <p className="text-sm text-on-surface-variant">Chiến dịch lừa đảo mới nhắm vào người dùng cuối năm với tin nhắn chứa ký tự Unicode đặc biệt để vượt qua bộ lọc spam của nhà mạng.</p>
              <button className="text-primary text-sm font-bold flex items-center gap-2 hover:underline">
                Tìm hiểu phương thức phòng tránh
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
          
          <GlassCard className="lg:col-span-4 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <LineChart className="text-primary w-5 h-5" />
                <span className="font-bold">Hiệu năng hệ thống</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-outline">Độ chính xác AI</span>
                  <span className="text-primary">99.8%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[99.8%] shadow-[0_0_8px_rgba(173,198,255,0.5)]"></div>
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-outline">Thời gian xử lý TB</span>
                  <span>1.2 giây</span>
                </div>
              </div>
            </div>
            <div className="mt-6 p-3 bg-primary-container/10 border border-primary/20 rounded text-center text-sm text-primary">
              Hệ thống đang hoạt động ổn định
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
