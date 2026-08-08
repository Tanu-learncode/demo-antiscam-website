"use client";
import { Shield, Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewType } from '../../types';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onAuthTransition?: (mode: 'login' | 'register', x: number, y: number) => void;
}

export function Header({ currentView, onViewChange, onAuthTransition }: HeaderProps) {
  const [user, setUser] = useState<{ id: string; name: string; email: string; role?: string; avatar?: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        if (!mounted) return;
        if (res.ok && data?.user) setUser(data.user);
      } catch (err) {
        // ignore
      }
    };
    
    fetchUser();

    const handleUpdate = () => {
      fetchUser();
    };
    
    window.addEventListener('user-updated', handleUpdate);

    return () => { 
      mounted = false; 
      window.removeEventListener('user-updated', handleUpdate);
    };
  }, []);

  const navItems: { id: ViewType; label: string }[] = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'analyzer', label: 'Kiểm tra AI' },
    { id: 'knowledge', label: 'Kho kiến thức' },
    { id: 'stats', label: 'Thống kê & Báo cáo' },
  ];

  if (user?.role === 'ADMIN') {
    navItems.push(
      { id: 'admin_articles', label: 'Quản lý bài viết' }
    );
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    onViewChange('home');
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (id: ViewType, e?: React.MouseEvent) => {
    if ((id === 'login' || id === 'register') && onAuthTransition && e) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      onAuthTransition(id, x, y);
    } else {
      onViewChange(id);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-sm"
    >
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => handleNavClick('home')}
        >
          <Shield className="text-primary h-6 w-6 transition-transform group-hover:scale-110 duration-300" />
          <div className="font-logo text-xl text-primary font-bold tracking-wider flex">
            {"ANTISCAM".split('').map((char, i) => (
              <motion.span
                key={i}
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={{
                  rest: { 
                    y: 0, 
                    scale: 1, 
                    textShadow: "0px 0px 0px rgba(125,168,255,0)",
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  },
                  hover: { 
                    y: -6, 
                    scale: 1.15, 
                    color: "#fff",
                    textShadow: "0px 8px 16px rgba(125,168,255,0.6)",
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 15
                    }
                  }
                }}
                className="inline-block px-[1px] md:px-[2px] transition-colors"
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-medium transition-colors ${
                currentView === item.id 
                  ? 'text-primary border-b-2 border-primary pb-1 font-bold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Shield className="text-primary hidden md:block h-5 w-5" />
          <div className="hidden md:flex gap-3 items-center">
            {!user ? (
              <>
                <button
                  onClick={(e) => handleNavClick('login', e)}
                  className="px-4 py-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={(e) => handleNavClick('register', e)}
                  className="px-6 py-2 bg-primary-container text-on-primary-container rounded-lg text-sm font-bold hover:brightness-110 transition-all active:scale-95"
                >
                  Đăng ký
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-on-surface-variant cursor-pointer" onClick={() => handleNavClick('profile')}>Xin chào, {user.name}</span>
                {user.avatar ? (
                  <img src={user.avatar} className="w-8 h-8 min-w-8 min-h-8 aspect-square shrink-0 rounded-full object-cover border border-primary/50 cursor-pointer" onClick={() => handleNavClick('profile')} />
                ) : (
                  <div onClick={() => handleNavClick('profile')} className="cursor-pointer w-8 h-8 min-w-8 min-h-8 aspect-square shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
          
          <button 
            className="md:hidden text-on-surface"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#060a14]/45"
            />
            <motion.div
              initial={{ x: '100%', opacity: 0, scale: 0.98 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: '100%', opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-80 max-w-[85vw] h-[100dvh] bg-surface-container border-l border-white/10 shadow-2xl flex flex-col pt-6 px-6 overflow-y-auto no-scrollbar"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 1.5rem)' }}
            >
              <div className="flex justify-between items-center mb-8 shrink-0">
                <div className="flex items-center gap-2">
                  <Shield className="text-primary h-6 w-6" />
                  <span className="font-logo text-xl text-primary font-bold tracking-wider">ANTISCAM</span>
                </div>
                <button 
                  className="text-on-surface p-2 -mr-2 rounded-full hover:bg-white/5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left text-lg font-medium transition-colors py-5 px-4 rounded-lg ${
                      currentView === item.id 
                        ? 'text-primary font-bold bg-primary/10' 
                        : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                {user && (
                  <>
                    <div 
                      className={`flex items-center gap-3 py-4 px-4 rounded-xl cursor-pointer transition-colors border ${
                        currentView === 'profile' 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'bg-surface-container-high border-white/5 hover:border-primary/30 hover:bg-white/5'
                      }`}
                      onClick={() => handleNavClick('profile')}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} className="w-12 h-12 min-w-12 min-h-12 aspect-square shrink-0 rounded-full object-cover border border-primary/50" />
                      ) : (
                        <div className="w-12 h-12 min-w-12 min-h-12 aspect-square shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-base font-bold text-on-surface truncate">{user.name}</span>
                        <span className="text-sm text-on-surface-variant truncate">{user.email}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="text-left text-lg font-bold text-error transition-colors py-5 px-4 rounded-lg hover:bg-error/10 mt-2"
                    >
                      Đăng xuất
                    </button>
                  </>
                )}
              </div>

              {!user && (
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
                  <button
                    onClick={() => handleNavClick('login')}
                    className="w-full py-4 text-center text-on-surface hover:text-primary transition-colors font-medium border border-outline-variant/50 rounded-xl"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => handleNavClick('register')}
                    className="w-full py-4 bg-primary-container text-on-primary-container rounded-xl text-center font-bold hover:brightness-110 transition-all active:scale-95"
                  >
                    Đăng ký
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
