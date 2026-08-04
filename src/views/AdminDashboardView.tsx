import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { CheckCircle, XCircle, Clock, Eye, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AdminDashboardView() {
  const [user, setUser] = useState<{ role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED'>('PENDING');
  const [posts, setPosts] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewingPost, setViewingPost] = useState<any | null>(null);
  const [editSections, setEditSections] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchPosts = () => {
    fetch(`/api/posts?status=${activeTab}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setPosts(data.posts);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchPosts();
    }
  }, [activeTab, user]);

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED', section?: string) => {
    let rejectReason = '';
    if (status === 'REJECTED') {
      const reason = prompt('Nhập lý do từ chối:');
      if (reason === null) return;
      rejectReason = reason;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectReason, section })
      });
      const data = await res.json();
      if (data.ok) {
        if (viewingPost?.id === id) setViewingPost(null);
        fetchPosts();
      } else {
        alert(data.message || 'Có lỗi xảy ra');
      }
    } catch (e) {
      alert('Đã có lỗi xảy ra');
    }
    setActionLoading(false);
  };

  if (loading) return <div className="pt-24 px-6 text-center">Đang tải...</div>;

  if (user?.role !== 'ADMIN') {
    return (
      <div className="pt-24 px-6 text-center text-error">
        <h1 className="text-2xl font-bold">Quyền truy cập bị từ chối</h1>
        <p>Bạn không có quyền truy cập trang quản trị.</p>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 pb-20 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-primary">Quản lý bài viết</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-outline-variant/30 pb-4">
        {[
          { id: 'PENDING', label: 'Chờ duyệt', icon: <Clock className="w-4 h-4" /> },
          { id: 'APPROVED', label: 'Đã duyệt', icon: <CheckCircle className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-primary text-on-primary' : 'hover:bg-surface-container-highest text-on-surface-variant'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <GlassCard className="overflow-x-auto">
        {posts.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            Không có bài viết nào trong mục này.
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-outline-variant/30 text-on-surface-variant text-sm bg-surface-container-highest/50">
                <th className="p-4 font-semibold rounded-tl-lg">Tiêu đề</th>
                <th className="p-4 font-semibold">Người đăng</th>
                <th className="p-4 font-semibold">Danh mục</th>
                <th className="p-4 font-semibold">Nơi đăng</th>
                <th className="p-4 font-semibold">Ngày tạo</th>
                <th className="p-4 font-semibold text-center rounded-tr-lg">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {posts.map((post, idx) => (
                  <motion.tr 
                    key={post.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`border-b border-outline-variant/10 hover:bg-surface-container-highest/30 transition-colors ${idx === posts.length - 1 ? 'border-none' : ''}`}
                  >
                    <td className="p-4 max-w-[200px] font-medium text-on-surface truncate" title={post.title}>
                      {post.title}
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant truncate max-w-[150px]">
                      {post.author?.name || 'Ẩn danh'}<br/>
                      <span className="text-xs opacity-70 truncate block">{post.author?.email}</span>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">{post.category}</td>
                    <td className="p-4 text-sm">
                      <span className="px-2 py-1 bg-surface-container rounded text-xs font-medium border border-outline-variant/20">
                        {post.section === 'KNOWLEDGE' ? '📖 Kiến thức' : '👥 Cộng đồng'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setViewingPost(post)}
                          className="p-2 bg-surface-container hover:bg-primary/20 text-on-surface hover:text-primary rounded-lg transition-colors tooltip-trigger"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {activeTab === 'PENDING' && (
                          <>
                            <button 
                              disabled={actionLoading}
                              onClick={() => handleAction(post.id, 'APPROVED', post.section)}
                              className="p-2 bg-success/10 hover:bg-success/20 text-success rounded-lg transition-colors disabled:opacity-50"
                              title="Duyệt"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              disabled={actionLoading}
                              onClick={() => handleAction(post.id, 'REJECTED')}
                              className="p-2 bg-error/10 hover:bg-error/20 text-error rounded-lg transition-colors disabled:opacity-50"
                              title="Từ chối"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {activeTab === 'APPROVED' && (
                          <button 
                            disabled={actionLoading}
                            onClick={() => handleAction(post.id, 'REJECTED')}
                            className="p-2 border border-error/50 hover:bg-error/10 text-error rounded-lg transition-colors disabled:opacity-50"
                            title="Bỏ duyệt (Từ chối)"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </GlassCard>

      {/* Modal Xem chi tiết */}
      <AnimatePresence>
        {viewingPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingPost(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-surface-container border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
                <h2 className="text-2xl font-bold text-on-surface">Chi tiết bài viết</h2>
                <button
                  onClick={() => setViewingPost(null)}
                  className="p-2 hover:bg-surface-container-highest rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-2xl font-bold text-on-surface mb-4">{viewingPost.title}</h3>
                
                <div className="flex flex-wrap gap-4 text-sm text-outline mb-6 p-4 bg-surface-container-highest rounded-lg">
                  <div><strong>Người đăng:</strong> {viewingPost.author?.name} ({viewingPost.author?.email})</div>
                  <div><strong>Ngày tạo:</strong> {new Date(viewingPost.createdAt).toLocaleString()}</div>
                  <div><strong>Danh mục:</strong> {viewingPost.category}</div>
                </div>

                {viewingPost.imageUrl && (
                  <div className="mb-6 rounded-lg overflow-hidden border border-outline-variant/30 max-w-lg mx-auto">
                    <img src={viewingPost.imageUrl} alt={viewingPost.title} className="w-full h-auto" />
                  </div>
                )}

                <div className="mb-6 whitespace-pre-wrap text-on-surface-variant leading-relaxed text-base">
                  {viewingPost.content}
                </div>

                {viewingPost.link && (
                  <div className="mb-6">
                    <a href={viewingPost.link} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">
                      🔗 {viewingPost.link}
                    </a>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-outline-variant/30 bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <label className="text-sm text-outline font-medium whitespace-nowrap">Đổi Nơi đăng (Tùy chọn):</label>
                  <select 
                    className="bg-surface-container border border-outline-variant rounded p-2 text-sm focus:border-primary"
                    value={editSections[viewingPost.id] || viewingPost.section}
                    onChange={(e) => setEditSections({...editSections, [viewingPost.id]: e.target.value})}
                  >
                    <option value="KNOWLEDGE">📖 Kiến thức</option>
                    <option value="COMMUNITY">👥 Cộng đồng</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {activeTab === 'PENDING' && (
                    <>
                      <button 
                        disabled={actionLoading}
                        onClick={() => handleAction(viewingPost.id, 'REJECTED', editSections[viewingPost.id] || viewingPost.section)}
                        className="px-6 py-2 bg-error/10 hover:bg-error/20 text-error font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <XCircle className="w-5 h-5" /> Từ chối
                      </button>
                      <button 
                        disabled={actionLoading}
                        onClick={() => handleAction(viewingPost.id, 'APPROVED', editSections[viewingPost.id] || viewingPost.section)}
                        className="px-6 py-2 bg-success hover:brightness-110 text-on-primary font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle className="w-5 h-5" /> Duyệt bài
                      </button>
                    </>
                  )}
                  {activeTab === 'APPROVED' && (
                    <button 
                      disabled={actionLoading}
                      onClick={() => handleAction(viewingPost.id, 'REJECTED', editSections[viewingPost.id] || viewingPost.section)}
                      className="px-6 py-2 border border-error/50 hover:bg-error/10 text-error font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5" /> Bỏ duyệt
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
