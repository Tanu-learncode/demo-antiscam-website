"use client";

import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';

type HistoryItem = {
  id: string;
  type: string;
  input: string;
  result: string;
  riskScore?: number | null;
  reason?: string | null;
  createdAt: string;
};

export function ProfileView() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; name?: string; email?: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // fetch small page of recent items (limit 10)
      const res = await fetch('/api/history?limit=10', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
      }

      // fetch user info for personal section
      const ures = await fetch('/api/auth/me', { cache: 'no-store' });
      const udata = await ures.json();
      if (ures.ok && udata?.user) setUser(udata.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const totalAnalyses = items.length; // only shows up to 10 here
  const lastAnalysis = items[0]?.createdAt;

  return (
    <div className="pt-24 px-6 pb-20 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Hồ sơ của tôi</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-2">Thông tin cá nhân</h2>
          <div className="text-sm text-on-surface-variant">
            <div><strong>Tên:</strong> {user?.name || '—'}</div>
            <div className="mt-1"><strong>Email:</strong> {user?.email || '—'}</div>
            <div className="mt-1"><strong>ID:</strong> {user?.id || '—'}</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-2">Dashboard</h2>
          <div className="text-sm text-on-surface-variant space-y-2">
            <div><strong>Tổng phân tích (hiển thị):</strong> {totalAnalyses}</div>
            <div><strong>Phân tích gần nhất:</strong> {lastAnalysis ? new Date(lastAnalysis).toLocaleString() : 'Chưa có'}</div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-2">Hành động</h2>
          <div className="flex flex-col gap-2">
            <button className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg text-sm font-bold">Thực hiện phân tích mới</button>
            <button className="px-4 py-2 border border-white/10 rounded-lg text-sm">Quản lý tài khoản</button>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold mb-4">Lịch sử phân tích gần đây</h2>
        {loading ? (
          <div className="text-sm text-on-surface-variant">Đang tải...</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-on-surface-variant">Chưa có lịch sử phân tích.</div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="p-3 rounded border border-white/5 flex justify-between items-start">
                <div className="max-w-[70%]">
                  <div className="text-sm font-medium">{it.type} — <span className="text-on-surface-variant text-xs">{new Date(it.createdAt).toLocaleString()}</span></div>
                  <div className="text-sm truncate mt-1">{it.input}</div>
                </div>
                <div className="text-sm font-semibold text-right">{it.result}</div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
