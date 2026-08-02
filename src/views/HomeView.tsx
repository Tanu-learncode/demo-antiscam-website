import { AlertTriangle, Brain, Lock, Shield, Upload } from 'lucide-react';
import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';

export function HomeView() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 px-6 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          AI Đã Sẵn Sàng Bảo Vệ Bạn
        </span>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight">
          Phát Hiện & Cảnh Báo <br/>
          <span className="text-primary text-glow-primary">Lừa Đảo Trực Tuyến</span> Bằng AI
        </h1>
        
        <p className="text-lg text-on-surface-variant max-w-2xl mb-10">
          Nền tảng AI phân tích liên kết, tin nhắn, hình ảnh và tài khoản ngân hàng để bảo vệ bạn khỏi các mối đe dọa trực tuyến phức tạp nhất.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-primary text-on-primary font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20">
            <Lock className="w-5 h-5" />
            Kiểm Tra Ngay
          </button>
          <button className="border border-primary text-primary font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-primary/5 transition-all">
            <AlertTriangle className="w-5 h-5" />
            Báo Cáo Lừa Đảo
          </button>
        </div>
      </section>

      {/* Mini Analyzer Section */}
      <section className="px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-6 items-start">
          <GlassCard className="lg:col-span-3 p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Brain className="text-primary w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">Trình Phân Tích Nội Dung</h2>
              </div>
              <span className="text-sm text-on-surface-variant">Version 2.4.1</span>
            </div>
            
            <div className="space-y-4">
              <textarea 
                className="w-full bg-surface-container-lowest border border-white/10 rounded-xl p-4 text-on-surface placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors min-h-[160px] resize-none" 
                placeholder="Dán liên kết (URL), nội dung tin nhắn hoặc thông tin tài khoản ngân hàng nghi ngờ tại đây..."
              ></textarea>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-high hover:bg-surface-container-highest border border-white/5 rounded-xl transition-all">
                  <Upload className="text-primary w-5 h-5" />
                  Tải ảnh màn hình
                </button>
                <button className="w-full sm:flex-1 bg-primary text-on-primary font-bold py-3 px-6 rounded-xl hover:brightness-110 transition-all">
                  Phân Tích AI
                </button>
              </div>
            </div>
          </GlassCard>

          <GlassCard glow="error" className="lg:col-span-2 p-6 relative">
            <div className="absolute -top-3 -right-3 px-3 py-1 bg-error-container text-on-error-container rounded-full text-xs font-bold animate-pulse">
              CẢNH BÁO
            </div>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                    <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray="226" strokeDashoffset="18" className="text-red-500" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-red-500">92%</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-500 mb-1">Nguy Cơ Cao</h3>
                  <p className="text-sm text-on-surface-variant">Phát hiện: 14:02, Hôm nay</p>
                </div>
              </div>
              <div className="bg-error-container/20 border border-red-500/30 rounded-xl p-4 mb-6">
                <p className="text-sm leading-relaxed">
                  <span className="font-bold text-red-400">Kết luận:</span> Liên kết này có dấu hiệu giả mạo ngân hàng. Các thành phần trang web được thiết kế để đánh cắp mật khẩu OTP.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Report Form */}
      <section className="px-6 max-w-4xl mx-auto">
        <GlassCard className="p-8 md:p-12 relative overflow-hidden border-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold mb-4">Gửi Báo Cáo Nghi Ngờ</h2>
            <p className="text-on-surface-variant max-w-xl mx-auto">Giúp cộng đồng bằng cách báo cáo các hành vi lừa đảo bạn gặp phải. AI sẽ xác minh và cảnh báo người dùng khác.</p>
          </div>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant block">Liên kết / Nội dung nghi ngờ</label>
                <input type="text" className="w-full bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-on-surface-variant block">Loại hình lừa đảo</label>
                <select className="w-full bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-on-surface">
                  <option>Chọn loại hình</option>
                  <option>Giả mạo ngân hàng</option>
                  <option>Lừa đảo trúng thưởng</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant block">Mô tả chi tiết</label>
              <textarea className="w-full bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary min-h-[120px] resize-none" placeholder="Mô tả cách bạn tiếp cận hoặc nội dung tin nhắn..."></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              Gửi Báo Cáo Ngay
            </button>
          </form>
        </GlassCard>
      </section>
    </div>
  );
}
