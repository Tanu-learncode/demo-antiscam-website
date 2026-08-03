"use client";
import { Shield } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ViewType } from '../../types';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        if (!mounted) return;
        if (res.ok && data?.user) setUser(data.user);
      } catch (err) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const navItems: { id: ViewType; label: string }[] = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'analyzer', label: 'Kiểm tra AI' },
    { id: 'knowledge', label: 'Kho kiến thức' },
    { id: 'stats', label: 'Thống kê & Báo cáo' },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    onViewChange('home');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-sm">
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onViewChange('home')}
        >
          <Shield className="text-primary h-6 w-6" />
          <span className="font-logo text-xl text-primary font-bold tracking-wider">ANTISCAM</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
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
          <div className="hidden sm:flex gap-3 items-center">
            {!user ? (
              <>
                <button
                  onClick={() => onViewChange('login')}
                  className="px-4 py-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => onViewChange('register')}
                  className="px-6 py-2 bg-primary-container text-on-primary-container rounded-lg text-sm font-bold hover:brightness-110 transition-all active:scale-95"
                >
                  Đăng ký
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-on-surface-variant cursor-pointer" onClick={() => onViewChange('profile')}>Xin chào, {user.name}</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{user.name?.split(' ')[0]?.[0] || 'U'}</div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-on-surface-variant hover:text-primary transition-colors font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
