'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, Check, AlertCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AuthMode = 'login' | 'register';

interface AuthViewProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode | 'home') => void;
}

export function AuthView({ mode, onModeChange }: AuthViewProps) {
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register State
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerMessage, setRegisterMessage] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validations
  const isConfirmPasswordMatch = registerConfirmPassword.length > 0 && registerConfirmPassword === registerPassword;
  const isConfirmPasswordError = registerConfirmPassword.length > 0 && registerConfirmPassword !== registerPassword;
  const canSubmitRegister = registerName.length > 0 && registerEmail.length > 0 && registerPassword.length >= 8 && isConfirmPasswordMatch;

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginMessage(null);
    setLoginLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginMessage(result?.message || 'Có lỗi xảy ra.');
        return;
      }
      setLoginMessage('Thành công.');
      window.location.href = '/';
    } catch (error) {
      console.error('Auth error:', error);
      setLoginMessage('Không thể kết nối tới máy chủ. Vui lòng thử lại.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmitRegister) return;
    
    setRegisterMessage(null);
    setRegisterLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: registerName, email: registerEmail, password: registerPassword }),
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok) {
        setRegisterMessage(result?.message || 'Có lỗi xảy ra.');
        return;
      }
      setRegisterMessage('Đăng ký thành công. Vui lòng đăng nhập.');
      // Auto switch to login
      setTimeout(() => onModeChange('login'), 1500);
    } catch (error) {
      console.error('Auth error:', error);
      setRegisterMessage('Không thể kết nối tới máy chủ. Vui lòng thử lại.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <section className="px-4 h-[100dvh] w-full flex items-center justify-center bg-[#0B1020] overflow-hidden relative font-sans fixed inset-0 z-50">
      
      {/* Background Cyber/AI Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5B8CFF]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#7DA8FF]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#143075]/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F3F6FF 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[900px] min-h-[600px] bg-[#141B2D]/80 backdrop-blur-[18px] border border-white/[0.08] rounded-[32px] shadow-[0_0_40px_rgba(91,140,255,0.05)] overflow-hidden flex flex-col md:block"
      >
        
        {/* Back Button */}
        <button
          onClick={() => onModeChange('home')}
          className="absolute top-6 left-6 z-50 p-2.5 rounded-full bg-white/5 text-[#AAB7D8] hover:text-[#F3F6FF] hover:bg-white/10 transition-all border border-white/5 backdrop-blur-md"
          title="Quay về trang chủ"
        >
          <ArrowLeft size={20} />
        </button>

        {/* --- SIGN IN FORM --- */}
        <div 
          className={`absolute top-0 left-0 h-full w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]
            ${mode === 'login' 
              ? 'z-20 translate-x-0 opacity-100 pointer-events-auto' 
              : 'z-0 -translate-x-full opacity-0 pointer-events-none'}
          `}
        >
          <form onSubmit={handleLogin} className="flex flex-col items-center justify-center h-full w-full pt-12 md:pt-0">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Shield className="w-12 h-12 text-[#7DA8FF] mb-3 mx-auto drop-shadow-[0_0_10px_rgba(125,168,255,0.3)]" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-3xl md:text-4xl font-extrabold text-[#F3F6FF] mb-2 tracking-tight">Đăng nhập</motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-[#AAB7D8] text-sm mb-8 text-center">Truy cập hệ thống bảo mật AntiScam</motion.p>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="w-full space-y-5 mb-8">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8FB4FF] opacity-70 group-focus-within:opacity-100 group-focus-within:text-[#7DA8FF] transition-all">
                  <Mail size={20} />
                </div>
                <input
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full bg-[#0B1020]/50 text-[#F3F6FF] placeholder-[#AAB7D8]/50 border border-white/[0.08] rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all duration-300 focus:border-[#7DA8FF] focus:bg-[#0B1020]/80 focus:shadow-[0_0_15px_rgba(125,168,255,0.15)]"
                  required
                />
              </div>

              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8FB4FF] opacity-70 group-focus-within:opacity-100 group-focus-within:text-[#7DA8FF] transition-all">
                  <Lock size={20} />
                </div>
                <input
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  className="w-full bg-[#0B1020]/50 text-[#F3F6FF] placeholder-[#AAB7D8]/50 border border-white/[0.08] rounded-2xl py-3.5 pl-12 pr-12 outline-none transition-all duration-300 focus:border-[#7DA8FF] focus:bg-[#0B1020]/80 focus:shadow-[0_0_15px_rgba(125,168,255,0.15)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#AAB7D8] hover:text-[#7DA8FF] transition-colors"
                >
                  {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {loginMessage && (
              <div className="w-full rounded-2xl border border-[#7DA8FF]/30 bg-[#7DA8FF]/10 px-4 py-3 text-sm text-[#7DA8FF] mb-6 text-center backdrop-blur-sm">
                {loginMessage}
              </div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-2xl bg-gradient-to-r from-[#7DA8FF] to-[#5B8CFF] px-5 py-4 text-sm font-bold text-[#0B1020] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_20px_rgba(125,168,255,0.4)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loginLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
            </motion.button>

            {/* Mobile Toggle */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }} className="mt-8 text-sm text-[#AAB7D8] md:hidden">
              Chưa có tài khoản?{' '}
              <button type="button" onClick={() => onModeChange('register')} className="text-[#8FB4FF] font-bold hover:text-[#7DA8FF] transition-colors">
                Đăng ký ngay
              </button>
            </motion.div>
          </form>
        </div>

        {/* --- SIGN UP FORM --- */}
        <div 
          className={`absolute top-0 left-0 md:left-auto md:right-0 h-full w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]
            ${mode === 'register' 
              ? 'z-20 translate-x-0 opacity-100 pointer-events-auto' 
              : 'z-10 translate-x-full opacity-0 pointer-events-none'}
          `}
        >
          <form onSubmit={handleRegister} className="flex flex-col items-center justify-center h-full w-full pt-12 md:pt-0">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Shield className="w-12 h-12 text-[#7DA8FF] mb-3 mx-auto drop-shadow-[0_0_10px_rgba(125,168,255,0.3)]" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-3xl md:text-4xl font-extrabold text-[#F3F6FF] mb-2 tracking-tight">Tạo tài khoản</motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-[#AAB7D8] text-sm mb-6 text-center">Bảo vệ bạn khỏi lừa đảo trực tuyến</motion.p>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="w-full space-y-4 mb-6">
              <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8FB4FF] opacity-70 group-focus-within:opacity-100 group-focus-within:text-[#7DA8FF] transition-all">
                  <User size={20} />
                </div>
                <input
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full bg-[#0B1020]/50 text-[#F3F6FF] placeholder-[#AAB7D8]/50 border border-white/[0.08] rounded-2xl py-3 pl-12 pr-4 outline-none transition-all duration-300 focus:border-[#7DA8FF] focus:bg-[#0B1020]/80 focus:shadow-[0_0_15px_rgba(125,168,255,0.15)]"
                  required
                />
              </div>

              <div>
                <div className="relative w-full group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8FB4FF] opacity-70 group-focus-within:opacity-100 group-focus-within:text-[#7DA8FF] transition-all">
                    <Mail size={20} />
                  </div>
                  <input
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                    className="w-full bg-[#0B1020]/50 text-[#F3F6FF] placeholder-[#AAB7D8]/50 border border-white/[0.08] rounded-2xl py-3 pl-12 pr-4 outline-none transition-all duration-300 focus:border-[#7DA8FF] focus:bg-[#0B1020]/80 focus:shadow-[0_0_15px_rgba(125,168,255,0.15)]"
                    required
                  />
                </div>
                <p className="text-[#AAB7D8]/60 text-[12px] mt-1.5 ml-2 italic">Lưu ý: Bạn có thể sử dụng email ảo để trải nghiệm các tính năng của website.</p>
              </div>

              <div>
                <div className="relative w-full group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8FB4FF] opacity-70 group-focus-within:opacity-100 group-focus-within:text-[#7DA8FF] transition-all">
                    <Lock size={20} />
                  </div>
                  <input
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu"
                    className={`w-full bg-[#0B1020]/50 text-[#F3F6FF] placeholder-[#AAB7D8]/50 border rounded-2xl py-3 pl-12 pr-12 outline-none transition-all duration-300 focus:bg-[#0B1020]/80 ${
                      registerPassword.length > 0 && registerPassword.length < 8 
                        ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
                        : 'border-white/[0.08] focus:border-[#7DA8FF] focus:shadow-[0_0_15px_rgba(125,168,255,0.15)]'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#AAB7D8] hover:text-[#7DA8FF] transition-colors"
                  >
                    {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <AnimatePresence>
                  {registerPassword.length > 0 && registerPassword.length < 8 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -5 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -5 }}
                      className="text-red-400 text-[13px] mt-1.5 ml-2 flex items-center gap-1.5"
                    >
                      <AlertCircle size={14} /> Mật khẩu phải có ít nhất 8 ký tự.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <motion.div 
                  className="relative w-full group"
                  animate={
                    isConfirmPasswordError 
                      ? { x: [-3, 3, -3, 3, 0] } 
                      : { x: 0 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#8FB4FF] opacity-70 group-focus-within:opacity-100 group-focus-within:text-[#7DA8FF] transition-all">
                    <Lock size={20} />
                  </div>
                  <motion.input
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận mật khẩu"
                    animate={{
                      borderColor: isConfirmPasswordMatch 
                        ? 'rgba(74, 222, 128, 0.5)' 
                        : isConfirmPasswordError
                          ? 'rgba(239, 68, 68, 0.5)' 
                          : 'rgba(255, 255, 255, 0.08)'
                    }}
                    transition={{ duration: 0.3 }}
                    className={`w-full bg-[#0B1020]/50 text-[#F3F6FF] placeholder-[#AAB7D8]/50 border rounded-2xl py-3 pl-12 pr-12 outline-none transition-shadow duration-300 focus:bg-[#0B1020]/80 ${
                      isConfirmPasswordMatch 
                        ? 'focus:shadow-[0_0_15px_rgba(74,222,128,0.15)]'
                        : isConfirmPasswordError 
                          ? 'focus:shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                          : 'focus:shadow-[0_0_15px_rgba(125,168,255,0.15)]'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#AAB7D8] hover:text-[#7DA8FF] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </motion.div>
                
                <AnimatePresence mode="wait">
                  {isConfirmPasswordMatch && (
                    <motion.div 
                      key="match"
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: 'auto', scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="text-green-400 text-[13px] mt-1.5 ml-2 flex items-center gap-1.5"
                    >
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                        <Check size={14} />
                      </motion.div>
                      Mật khẩu khớp.
                    </motion.div>
                  )}
                  {isConfirmPasswordError && (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-[13px] mt-1.5 ml-2 flex items-center gap-1.5"
                    >
                      <AlertCircle size={14} /> Mật khẩu xác nhận không khớp.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {registerMessage && (
              <div className="w-full rounded-2xl border border-[#7DA8FF]/30 bg-[#7DA8FF]/10 px-4 py-3 text-sm text-[#7DA8FF] mb-6 text-center backdrop-blur-sm">
                {registerMessage}
              </div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
              type="submit"
              disabled={registerLoading || !canSubmitRegister}
              className="w-full rounded-2xl bg-gradient-to-r from-[#7DA8FF] to-[#5B8CFF] px-5 py-4 text-sm font-bold text-[#0B1020] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_0_20px_rgba(125,168,255,0.4)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {registerLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ'}
            </motion.button>

            {/* Mobile Toggle */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }} className="mt-8 text-sm text-[#AAB7D8] md:hidden">
              Đã có tài khoản?{' '}
              <button type="button" onClick={() => onModeChange('login')} className="text-[#8FB4FF] font-bold hover:text-[#7DA8FF] transition-colors">
                Đăng nhập
              </button>
            </motion.div>
          </form>
        </div>

        {/* --- OVERLAY PANEL (DESKTOP ONLY) --- */}
        <div 
          className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] z-50 rounded-[32px] border border-white/5
            ${mode === 'register' ? '-translate-x-full' : 'translate-x-0'}
          `}
        >
          <div 
            className={`bg-gradient-to-br from-[#0B1020] via-[#14234B] to-[#1F3D8A] absolute top-0 -left-[100%] w-[200%] h-full transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]
              ${mode === 'register' ? 'translate-x-1/2' : 'translate-x-0'}
            `}
          >
            {/* Overlay Inner Cyber Details */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #8FB4FF 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#7DA8FF]/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none"></div>

            {/* Overlay Register Content (Shown on Right) */}
            <div 
              className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center items-center px-14 text-center text-[#F3F6FF] transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                ${mode === 'login' ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-[20%] opacity-0 pointer-events-none'}
              `}
            >
              <h2 className="text-4xl font-extrabold mb-5 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#AAB7D8]">Hello, Friend!</h2>
              <p className="text-[15px] text-[#AAB7D8] mb-10 leading-relaxed">
                Đăng ký tài khoản để sử dụng đầy đủ các tính năng bảo vệ khỏi lừa đảo.
              </p>
              <button 
                onClick={() => onModeChange('register')}
                className="px-10 py-3.5 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md text-[#F3F6FF] font-bold tracking-wider hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(125,168,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
              >
                ĐĂNG KÝ
              </button>
            </div>

            {/* Overlay Login Content (Shown on Left) */}
            <div 
              className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center px-14 text-center text-[#F3F6FF] transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]
                ${mode === 'register' ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-[20%] opacity-0 pointer-events-none'}
              `}
            >
              <h2 className="text-4xl font-extrabold mb-5 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-[#AAB7D8]">Welcome Back!</h2>
              <p className="text-[15px] text-[#AAB7D8] mb-10 leading-relaxed">
                Bạn đã có tài khoản? Hãy đăng nhập để truy cập hệ thống.
              </p>
              <button 
                onClick={() => onModeChange('login')}
                className="px-10 py-3.5 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md text-[#F3F6FF] font-bold tracking-wider hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:shadow-[0_0_15px_rgba(125,168,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
              >
                ĐĂNG NHẬP
              </button>
            </div>
          </div>
        </div>

      </motion.div>
    </section>
  );
}
