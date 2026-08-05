import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { CreatePostModal } from '../components/ui/CreatePostModal';
import { ConfirmDeleteModal } from '../components/ui/ConfirmDeleteModal';
import { Toast } from '../components/ui/Toast';
import { CheckCircle, XCircle, Clock, List, Edit2, Trash2, Eye, RefreshCw, ArrowLeft } from 'lucide-react';

export function MyPostsView({ onViewDetail, onBack }: { onViewDetail?: (id: string) => void, onBack?: () => void }) {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [editPost, setEditPost] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error', isVisible: boolean }>({ 
    message: '', 
    type: 'success', 
    isVisible: false 
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.user) {
          setUser(data.user);
          fetchPosts(data.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchPosts = (userId: string) => {
    setLoading(true);
    fetch(`/api/posts?authorId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setPosts(data.posts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postToDelete}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) {
        setPosts(posts.filter(p => p.id !== postToDelete));
        setToast({ message: 'Đã xóa bài viết thành công.', type: 'success', isVisible: true });
        setDeleteModalOpen(false);
      } else {
        setToast({ message: data.message || 'Xóa bài viết thất bại.', type: 'error', isVisible: true });
      }
    } catch (e) {
      setToast({ message: 'Đã có lỗi xảy ra', type: 'error', isVisible: true });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (post: any) => {
    setEditPost(post);
    setIsModalOpen(true);
  };

  const handleModalClose = (success?: boolean) => {
    setIsModalOpen(false);
    setEditPost(null);
    if (success && user) {
      fetchPosts(user.id);
    }
  };

  if (loading) return <div className="pt-24 px-6 text-center text-on-surface-variant animate-pulse font-medium">Đang tải...</div>;
  if (!user) return <div className="pt-24 px-6 text-center text-error">Vui lòng đăng nhập</div>;

  const filteredPosts = activeTab === 'ALL' ? posts : posts.filter(p => p.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'APPROVED': return <span className="px-2 py-1 bg-success/20 text-success rounded text-xs font-bold">Đã duyệt</span>;
      case 'REJECTED': return <span className="px-2 py-1 bg-error/20 text-error rounded text-xs font-bold">Từ chối</span>;
      default: return <span className="px-2 py-1 bg-warning/20 text-warning rounded text-xs font-bold">Chờ duyệt</span>;
    }
  };

  return (
    <div className="pt-24 px-6 pb-20 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 bg-surface-container-highest hover:bg-primary/20 text-on-surface hover:text-primary rounded-full transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-3xl font-bold text-primary">Bài viết của tôi</h1>
        <div className="ml-auto">
          <button 
            onClick={() => { setEditPost(null); setIsModalOpen(true); }}
            className="px-4 py-2 bg-primary text-on-primary font-bold rounded-full hover:brightness-110 transition-all whitespace-nowrap"
          >
            + Đăng bài mới
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-8 border-b border-outline-variant/30 pb-4">
        {[
          { id: 'ALL', label: 'Tất cả', icon: <List className="w-4 h-4" /> },
          { id: 'PENDING', label: 'Chờ duyệt', icon: <Clock className="w-4 h-4" /> },
          { id: 'APPROVED', label: 'Đã duyệt', icon: <CheckCircle className="w-4 h-4" /> },
          { id: 'REJECTED', label: 'Đã từ chối', icon: <XCircle className="w-4 h-4" /> },
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

      <div className="grid grid-cols-1 gap-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            Không có bài viết nào trong mục này.
          </div>
        ) : (
          filteredPosts.map(post => (
            <GlassCard key={post.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-on-surface line-clamp-2">{post.title}</h3>
                    {getStatusBadge(post.status)}
                  </div>
                  <div className="flex gap-2 text-sm text-outline mb-4">
                    <span className="px-2 py-1 bg-surface-container-highest rounded">{post.category}</span>
                    <span className="px-2 py-1 bg-surface-container-highest rounded">
                      {post.section === 'KNOWLEDGE' ? '📖 Kiến thức' : '👥 Cộng đồng'}
                    </span>
                    <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {post.status === 'REJECTED' && post.rejectReason && (
                    <div className="mb-4 p-4 bg-error-container text-on-error-container rounded-lg text-sm border border-error/20">
                      <div className="font-bold flex items-center gap-2 mb-1">
                        <XCircle className="w-4 h-4" /> Lý do từ chối:
                      </div>
                      <p>{post.rejectReason}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 md:flex-col md:w-32">
                  <button 
                    onClick={() => onViewDetail && onViewDetail(post.id)}
                    className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-surface-container-highest hover:bg-primary/20 text-on-surface font-semibold rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Xem
                  </button>
                  <button 
                    onClick={() => handleEdit(post)}
                    className={`w-full flex justify-center items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-colors ${post.status === 'REJECTED' ? 'bg-primary text-on-primary hover:brightness-110' : 'bg-surface-container-highest hover:bg-primary/20 text-on-surface'}`}
                  >
                    {post.status === 'REJECTED' ? <><RefreshCw className="w-4 h-4" /> Gửi lại</> : <><Edit2 className="w-4 h-4" /> Sửa</>}
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(post.id)}
                    className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-error/10 hover:bg-error/20 text-error font-semibold rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Xoá
                  </button>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        editPost={editPost} 
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
