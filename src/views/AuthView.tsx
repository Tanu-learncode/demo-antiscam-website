'use client';

import React, { useState } from 'react';

type AuthMode = 'login' | 'register';

interface AuthViewProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode | 'home') => void;
}

export function AuthView({ mode, onModeChange }: AuthViewProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    const payload: Record<string, string> = {
      email,
      password,
    };

    if (mode === 'register') {
      payload.name = name;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result?.message || 'Có lỗi xảy ra.');
        return;
      }

      setMessage(result?.message || 'Thành công.');
      if (mode === 'login') {
        setEmail('');
        setPassword('');
      } else {
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessage('Không thể kết nối tới máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 py-24 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-surface/80">
      <div className="w-full max-w-2xl bg-surface-container-high/95 border border-white/10 rounded-3xl shadow-2xl shadow-black/10 p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-2 mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h1>
          <p className="text-sm text-on-surface-variant">
            {mode === 'login'
              ? 'Nhập thông tin tài khoản để truy cập hệ thống.'
              : 'Tạo tài khoản mới để sử dụng tính năng bảo vệ và cảnh báo lừa đảo.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              mode === 'login'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
            onClick={() => onModeChange('login')}
          >
            Đăng nhập
          </button>
          <button
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              mode === 'register'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
            onClick={() => onModeChange('register')}
          >
            Đăng ký
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-on-surface-variant">Họ và tên</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Nguyễn Văn A"
                className="w-full rounded-2xl border border-white/10 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-primary"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface-variant">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-on-surface-variant">Mật khẩu</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-white/10 bg-surface-container-low px-4 py-3 text-on-surface outline-none transition focus:border-primary"
              required
            />
          </div>

          {message && (
            <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-on-primary transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>

          <div className="text-center text-sm text-on-surface-variant">
            <button
              type="button"
              className="font-semibold text-primary hover:underline"
              onClick={() => onModeChange('home')}
            >
              Quay về trang chủ
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
