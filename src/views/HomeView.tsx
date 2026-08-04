"use client";

import { AlertTriangle, Lock, Shield, Globe, Mail, MessageSquare, Image as ImageIcon, ArrowRight, Bot, Layers, History, Zap, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/ui/GlassCard';
import { ViewType } from '../types';

interface HomeViewProps {
  onViewChange?: (view: ViewType) => void;
}

export function HomeView({ onViewChange }: HomeViewProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-32 px-6 flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6"
        >
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          AI Đã Sẵn Sàng Bảo Vệ Bạn
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight"
        >
          Phát Hiện & Cảnh Báo <br/>
          <span className="text-primary text-glow-primary">Lừa Đảo Trực Tuyến</span> Bằng AI
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-on-surface-variant max-w-2xl mb-10"
        >
          Nền tảng AI phân tích liên kết, tin nhắn, hình ảnh để bảo vệ bạn khỏi các mối đe dọa trực tuyến phức tạp nhất.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <button 
            onClick={() => {
              if (onViewChange) onViewChange('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-primary text-on-primary font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            <Lock className="w-5 h-5" />
            Kiểm Tra Ngay
          </button>
        </motion.div>
      </section>

      {/* SECTION 1: AntiScam AI có thể giúp bạn kiểm tra */}
      <section className="px-6 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold mb-4">AntiScam AI có thể giúp bạn kiểm tra</h2>
          <p className="text-on-surface-variant text-lg">Phân tích nhiều loại nội dung để phát hiện các dấu hiệu lừa đảo trực tuyến bằng AI.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="h-full"
          >
            <GlassCard className="h-full p-5 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default group">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-1">URL</h3>
              <p className="text-on-surface-variant text-sm">Phát hiện website giả mạo, link độc hại.</p>
            </GlassCard>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            <GlassCard className="h-full p-5 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default group">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-1">Email</h3>
              <p className="text-on-surface-variant text-sm">Nhận diện email lừa đảo, phishing.</p>
            </GlassCard>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <GlassCard className="h-full p-5 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default group">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-1">Tin nhắn</h3>
              <p className="text-on-surface-variant text-sm">Phân tích tin nhắn lừa đảo.</p>
            </GlassCard>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="h-full"
          >
            <GlassCard className="h-full p-5 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default group">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-1">Hình ảnh</h3>
              <p className="text-on-surface-variant text-sm">Quét nội dung hình ảnh bằng OCR.</p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Vì sao nên chọn */}
      <section className="px-6 max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Vì sao nên chọn AntiScam AI?</h2>
            <p className="text-on-surface-variant text-lg">Bảo vệ bạn toàn diện trước các hình thức lừa đảo ngày càng tinh vi.</p>
          </motion.div>
          
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="group flex items-stretch gap-4 cursor-default transition-all duration-300 hover:translate-x-2"
              onMouseEnter={() => setHoveredFeature(0)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="w-1 bg-white/10 rounded-full transition-colors duration-300 group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(var(--color-primary),0.5)] my-1"></div>
              
              <div className="flex items-start gap-4 py-1">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(var(--color-primary),0.5)]">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 transition-colors duration-300 group-hover:text-primary">Gemini AI</h3>
                  <p className="text-on-surface-variant text-sm transition-colors duration-300 group-hover:text-on-surface">Phân tích chuyên sâu và chính xác bằng AI tiên tiến.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="group flex items-stretch gap-4 cursor-default transition-all duration-300 hover:translate-x-2"
              onMouseEnter={() => setHoveredFeature(1)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="w-1 bg-white/10 rounded-full transition-colors duration-300 group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(var(--color-primary),0.5)] my-1"></div>
              
              <div className="flex items-start gap-4 py-1">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(var(--color-primary),0.5)]">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 transition-colors duration-300 group-hover:text-primary">Phân tích đa định dạng</h3>
                  <p className="text-on-surface-variant text-sm transition-colors duration-300 group-hover:text-on-surface">Hỗ trợ URL, Email, Tin nhắn và cả Hình ảnh.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="group flex items-stretch gap-4 cursor-default transition-all duration-300 hover:translate-x-2"
              onMouseEnter={() => setHoveredFeature(2)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="w-1 bg-white/10 rounded-full transition-colors duration-300 group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(var(--color-primary),0.5)] my-1"></div>
              
              <div className="flex items-start gap-4 py-1">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(var(--color-primary),0.5)]">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 transition-colors duration-300 group-hover:text-primary">Lưu lịch sử</h3>
                  <p className="text-on-surface-variant text-sm transition-colors duration-300 group-hover:text-on-surface">Xem lại các cảnh báo bất cứ lúc nào khi đăng nhập.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="group flex items-stretch gap-4 cursor-default transition-all duration-300 hover:translate-x-2"
              onMouseEnter={() => setHoveredFeature(3)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="w-1 bg-white/10 rounded-full transition-colors duration-300 group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(var(--color-primary),0.5)] my-1"></div>
              
              <div className="flex items-start gap-4 py-1">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(var(--color-primary),0.5)]">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 transition-colors duration-300 group-hover:text-primary">Phân tích nhanh</h3>
                  <p className="text-on-surface-variant text-sm transition-colors duration-300 group-hover:text-on-surface">Trả kết quả gần như ngay lập tức chỉ sau vài giây.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
              className="group flex items-stretch gap-4 cursor-default transition-all duration-300 hover:translate-x-2"
              onMouseEnter={() => setHoveredFeature(4)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="w-1 bg-white/10 rounded-full transition-colors duration-300 group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(var(--color-primary),0.5)] my-1"></div>
              
              <div className="flex items-start gap-4 py-1">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(var(--color-primary),0.5)]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 transition-colors duration-300 group-hover:text-primary">Bảo mật dữ liệu</h3>
                  <p className="text-on-surface-variant text-sm transition-colors duration-300 group-hover:text-on-surface">An toàn tuyệt đối, không chia sẻ với bên thứ ba.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex-1 w-full flex justify-center relative"
        >
          <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full transition-all duration-500 ${hoveredFeature !== null ? 'bg-primary/40 blur-[100px] scale-110' : 'bg-primary/20 blur-[80px] animate-pulse'}`}></div>
            
            <svg viewBox="0 0 100 120" className="w-full h-full text-primary relative z-10 transition-transform duration-500" style={{ transform: hoveredFeature !== null ? 'scale(1.05)' : 'scale(1)' }} fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M50 5 L90 20 L90 60 C90 90 50 115 50 115 C50 115 10 90 10 60 L10 20 Z" 
                    className={`transition-colors duration-500 ${hoveredFeature !== null ? 'stroke-primary/80' : 'stroke-primary/30'}`}
                    strokeLinejoin="round" 
                    strokeLinecap="round" />
              <path d="M50 15 L80 27 L80 60 C80 82 50 102 50 102 C50 102 20 82 20 60 L20 27 Z" 
                    className={`transition-all duration-500 fill-surface-container-high/80 backdrop-blur-md ${hoveredFeature !== null ? 'stroke-primary shadow-[0_0_20px_rgba(var(--color-primary),0.8)]' : 'stroke-primary'}`}
                    strokeLinejoin="round" 
                    strokeLinecap="round" />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className={`p-6 bg-primary/10 rounded-full border transition-all duration-500 backdrop-blur-sm shadow-[0_0_30px_rgba(var(--color-primary),0.3)] ${hoveredFeature !== null ? 'border-primary shadow-[0_0_50px_rgba(var(--color-primary),0.8)] scale-110' : 'border-primary/30 animate-pulse'}`}>
                <Bot className={`w-16 h-16 text-primary transition-all duration-500 ${hoveredFeature !== null ? 'drop-shadow-[0_0_10px_rgba(var(--color-primary),0.8)]' : ''}`} />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
