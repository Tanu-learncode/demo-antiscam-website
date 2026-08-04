"use client";

import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { AnalysisHistoryModal, type AnalysisItem } from '../components/ui/AnalysisHistoryModal';
import { createPortal } from 'react-dom';
import { ShieldCheck, AlertTriangle, User, Settings, LogOut, Camera, Trash2, X, Activity } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { ViewType } from '../types';

function CountUpText({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = value / (duration / 16);
    let handle: number;

    const update = () => {
      start += increment;
      if (start < value) {
        setCount(Math.ceil(start));
        handle = requestAnimationFrame(update);
      } else {
        setCount(value);
      }
    };
    update();
    return () => cancelAnimationFrame(handle);
  }, [value]);

  return <span>{count}</span>;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export function ProfileView({ onViewChange }: { onViewChange?: (view: ViewType) => void }) {
  const [items, setItems] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history?limit=100', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) setItems(data.items || []);

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

  const totalAnalyses = items.length;
  const safeAnalyses = items.filter(it => it.riskLevel.toLowerCase() === 'low').length;
  const warningAnalyses = items.filter(it => it.riskLevel.toLowerCase() === 'medium' || it.riskLevel.toLowerCase() === 'high').length;
  
  // Safety Score
  const safetyScore = totalAnalyses === 0 ? 100 : Math.round((safeAnalyses / totalAnalyses) * 100);
  let scoreLabel = '';
  let scoreColor = '';
  if (safetyScore <= 40) {
    scoreLabel = 'Cần cải thiện';
    scoreColor = 'bg-error text-error';
  } else if (safetyScore <= 70) {
    scoreLabel = 'Bình thường';
    scoreColor = 'bg-warning text-warning';
  } else {
    scoreLabel = 'Rất an toàn';
    scoreColor = 'bg-success text-success';
  }

  // Badges
  const approvedPosts = user?.posts?.length || 0;
  let badgeIcon = '🥉';
  let badgeName = 'Thành viên mới';
  let badgeColor = 'from-[#d4af37]/20 to-[#aa7c11]/10 border-[#d4af37]/40 text-[#d4af37]';
  
  if (approvedPosts >= 6) {
    badgeIcon = '🥇';
    badgeName = 'Chuyên gia AntiScam';
    badgeColor = 'from-yellow-400/20 to-yellow-600/10 border-yellow-400/40 text-yellow-400';
  } else if (approvedPosts >= 3) {
    badgeIcon = '🥈';
    badgeName = 'Người chia sẻ tích cực';
    badgeColor = 'from-gray-300/20 to-gray-500/10 border-gray-300/40 text-gray-300';
  } else {
    badgeColor = 'from-orange-400/20 to-orange-600/10 border-orange-400/40 text-orange-400';
  }

  return (
    <div className="pt-24 px-6 pb-20 max-w-6xl mx-auto space-y-6">
      <AnalysisHistoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        items={items} 
        loading={loading} 
      />
      <AccountSettingsModal 
        isOpen={isSettingsOpen}
        user={user} 
        onClose={() => setIsSettingsOpen(false)} 
        onUpdate={fetchData} 
        onViewChange={onViewChange}
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-3xl font-bold text-on-surface flex items-center gap-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.08 }}
            className="relative cursor-pointer group"
            onClick={() => setIsSettingsOpen(true)}
          >
            {user?.avatar ? (
              <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-primary/50 group-hover:shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl group-hover:shadow-[0_0_15px_rgba(45,212,191,0.5)] transition-all">
                {user?.name?.charAt(0)?.toUpperCase() || <User className="w-6 h-6" />}
              </div>
            )}
          </motion.div>
          Hồ sơ của tôi
        </h1>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="px-4 py-2 bg-surface-container border border-outline-variant/30 rounded-xl text-sm font-bold hover:border-primary/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
        >
          <Settings className="w-4 h-4" /> Quản lý tài khoản
        </button>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Cột 1: Thông tin & Huy hiệu */}
        <motion.div variants={itemVariants} className="space-y-6">
          <GlassCard className="p-6 relative overflow-hidden hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4 text-on-surface flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Thông tin cá nhân
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 relative z-10">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="opacity-70">Tên hiển thị:</span>
                <strong className="text-on-surface">{user?.name || '—'}</strong>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="opacity-70">Email:</span>
                <strong className="text-on-surface">{user?.email || '—'}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-70">Vai trò:</span>
                {loading ? (
                  <div className="h-5 w-16 bg-white/10 rounded animate-pulse"></div>
                ) : (
                  <strong className="text-primary bg-primary/10 px-2 py-0.5 rounded uppercase text-xs tracking-wider">{user?.role || 'USER'}</strong>
                )}
              </div>
            </div>
          </GlassCard>

          <GlassCard className={`p-6 border bg-gradient-to-br ${badgeColor} relative overflow-hidden hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300`}>
            <div className="relative z-10 text-center">
              <h2 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Huy hiệu hoạt động</h2>
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
                className="text-5xl mb-3"
              >
                {badgeIcon}
              </motion.div>
              <h3 className="text-xl font-bold mb-1">{badgeName}</h3>
              <p className="text-xs opacity-80">Đã đóng góp {approvedPosts} bài viết chất lượng.</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          </GlassCard>
        </motion.div>

        {/* Cột 2: Lịch sử & Safety Score */}
        <motion.div variants={itemVariants} className="space-y-6">
          <GlassCard className="p-6 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4 text-on-surface flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-success" /> Lịch sử phân tích
            </h2>
            <div className="text-sm text-on-surface-variant space-y-3 mb-6">
              <div className="flex justify-between items-center bg-surface-container-lowest p-3 rounded-lg border border-white/5">
                <span>Tổng số lần quét:</span> 
                <strong className="text-lg text-on-surface"><CountUpText value={totalAnalyses} /></strong>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-success" /> An toàn:</span> 
                <strong className="text-success"><CountUpText value={safeAnalyses} /></strong>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning" /> Cảnh báo rủi ro:</span> 
                <strong className="text-warning"><CountUpText value={warningAnalyses} /></strong>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full px-4 py-2 border border-primary/30 text-primary hover:bg-primary/10 rounded-xl text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all"
            >
              Xem toàn bộ lịch sử
            </button>
          </GlassCard>

          <GlassCard className="p-6 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Safety Score
              </h2>
              <span className={`text-2xl font-bold ${scoreColor.split(' ')[1]}`}>
                <CountUpText value={safetyScore} />/100
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">Mức độ an toàn trong các liên kết bạn thường xuyên truy cập.</p>
            
            <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden mb-2">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${safetyScore}%` }} 
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                className={`h-full rounded-full ${scoreColor.split(' ')[0]}`}
              ></motion.div>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-error">Nguy hiểm</span>
              <span className={`px-2 py-0.5 rounded-full ${scoreColor.split(' ')[0]}/20 ${scoreColor.split(' ')[1]}`}>{scoreLabel}</span>
              <span className="text-success">An toàn</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Cột 3: Hành động nhanh & Recent */}
        <motion.div variants={itemVariants} className="space-y-6">
          <GlassCard className="p-6 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4 text-on-surface">Thao tác nhanh</h2>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setIsNavigating(true);
                  setTimeout(() => { if (onViewChange) onViewChange('analyzer'); }, 400);
                }}
                disabled={isNavigating}
                className="relative overflow-hidden w-full px-4 py-3 bg-primary text-on-primary rounded-xl text-sm font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-70 group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isNavigating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang chuyển...
                    </>
                  ) : (
                    'Thực hiện phân tích mới'
                  )}
                </span>
                <div className="absolute inset-0 bg-white/30 opacity-0 group-active:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={() => onViewChange && onViewChange('my_posts')}
                className="w-full px-4 py-3 border border-outline-variant/30 text-on-surface hover:bg-surface-container rounded-xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all text-left flex items-center gap-3"
              >
                📝 Bài viết cộng đồng của tôi
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-6 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
             <h2 className="text-sm font-semibold text-on-surface mb-4 uppercase tracking-wider opacity-70">Vừa phân tích</h2>
             {loading ? (
                <div className="text-sm text-on-surface-variant text-center py-4 flex flex-col items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Đang tải...
                </div>
             ) : items.length === 0 ? (
                <div className="text-sm text-on-surface-variant text-center py-4">Chưa có lịch sử.</div>
             ) : (
                <div className="space-y-3">
                  {items.slice(0, 3).map((it) => (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      key={it.id} 
                      onClick={() => setIsModalOpen(true)}
                      className="p-3 rounded-lg border border-white/5 bg-surface-container-lowest hover:border-primary/30 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold truncate max-w-[150px]">{it.detectedType}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          it.riskLevel.toLowerCase() === 'high' ? 'bg-error/10 text-error' : 
                          it.riskLevel.toLowerCase() === 'medium' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                        }`}>
                          {it.riskLevel}
                        </span>
                      </div>
                      <div className="text-xs text-on-surface-variant truncate">{it.content}</div>
                    </motion.div>
                  ))}
                </div>
             )}
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}

// --- ACCOUNT SETTINGS MODAL ---
function AccountSettingsModal({ isOpen, user, onClose, onUpdate, onViewChange }: { isOpen: boolean, user: any, onClose: () => void, onUpdate: () => void, onViewChange?: (v: ViewType) => void }) {
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return alert("Ảnh quá lớn. Vui lòng chọn ảnh < 2MB");
    
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setTimeout(() => {
          setAvatar(ev.target!.result as string);
          setIsUploading(false);
        }, 500); // fake loading for smooth animation
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { name, avatar };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
      
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.ok) {
        // No alert, just seamless close
        window.dispatchEvent(new Event('user-updated'));
        onUpdate();
        onClose();
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      alert("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.reload();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me', { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      alert("Có lỗi xảy ra khi xoá.");
      setLoading(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && user && (
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
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-surface-container border border-outline-variant/30 rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-outline hover:text-on-surface transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            
            {deleteConfirm ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} 
                className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]"
              >
                <AlertTriangle className="w-16 h-16 text-error mb-4 animate-pulse" />
                <h2 className="text-xl font-bold text-on-surface mb-2">Xác nhận xoá tài khoản?</h2>
                <p className="text-on-surface-variant text-sm mb-8">Bạn sẽ mất toàn bộ dữ liệu, lịch sử quét AI, bài viết cộng đồng và huy hiệu hiện có.</p>
                <div className="flex w-full gap-3">
                  <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-3 bg-surface-container-highest rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all">Huỷ bỏ</button>
                  <button onClick={handleDelete} disabled={loading} className="flex-1 py-3 bg-error text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    Xác nhận Xoá
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSave} className="p-8">
                <h2 className="text-xl font-bold mb-6 text-on-surface flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" /> Quản lý tài khoản
                </h2>
                
                {/* Avatar Selection */}
                <div className="flex flex-col items-center mb-8 relative">
                  <div className="w-24 h-24 rounded-full bg-surface-container-highest border-4 border-surface group relative cursor-pointer shadow-lg overflow-hidden">
                    <AnimatePresence mode="wait">
                      {isUploading ? (
                        <motion.div 
                          key="spinner"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10"
                        >
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="avatar"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", damping: 15 }}
                          className="w-full h-full"
                        >
                          {avatar ? (
                            <img src={avatar} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">
                              {user?.name?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-30" />
                  </div>
                  <p className="text-xs text-on-surface-variant mt-3">Nhấp vào ảnh để thay đổi</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email (Chỉ đọc)</label>
                    <input type="text" value={user?.email || ''} disabled className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-xl px-4 py-3 text-sm opacity-60 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Tên hiển thị</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all" />
                  </div>
                  <div className="pt-4 border-t border-outline-variant/20">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Đổi mật khẩu (Tuỳ chọn)</label>
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Mật khẩu cũ" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all mb-3" />
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-all" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all mb-4 flex items-center justify-center gap-2">
                  {loading && <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>}
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>

                <div className="flex gap-3">
                  <button type="button" onClick={handleLogout} className="flex-1 py-3 border border-outline-variant/30 rounded-xl text-sm font-bold hover:bg-surface-container-highest active:scale-95 transition-all flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                  <button type="button" onClick={() => setDeleteConfirm(true)} className="flex-1 py-3 border border-error/30 text-error hover:bg-error/10 rounded-xl text-sm font-bold active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" /> Xoá tài khoản
                  </button>
                </div>
              </form>
            )}
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
