import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Clock, AlertTriangle } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { ViewType } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2 } from 'lucide-react';

interface PostDetailViewProps {
  postId: string | null;
  onBack: (view: ViewType) => void;
}

export function PostDetailView({ postId, onBack }: PostDetailViewProps) {
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      try {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      } catch (e) { return url; }
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState<{ id: string; role: string; name: string } | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!postId) {
      setError(true);
      setLoading(false);
      return;
    }

    fetch(`/api/posts/${postId}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.post) {
          setPost(data.post);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [postId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      });
      const data = await res.json();
      if (data.ok && data.comment) {
        setPost((prev: any) => ({
          ...prev,
          comments: [...(prev.comments || []), data.comment]
        }));
        setNewComment('');
      } else {
        alert(data.message || 'Lỗi gửi bình luận');
      }
    } catch (err) {
      alert('Có lỗi xảy ra');
    }
    setSubmittingComment(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) {
        setPost((prev: any) => ({
          ...prev,
          comments: (prev.comments || []).filter((c: any) => c.id !== commentId)
        }));
      } else {
        alert(data.message || 'Lỗi xóa bình luận');
      }
    } catch (err) {
      alert('Có lỗi xảy ra');
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-20 px-6 md:px-8 max-w-3xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="text-xl font-medium text-on-surface-variant animate-pulse">Đang tải bài viết...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-24 pb-20 px-6 md:px-8 max-w-3xl mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-20 h-20 text-error mb-6 opacity-80" />
        <h1 className="text-4xl font-bold text-on-surface mb-4">404 - Không tìm thấy</h1>
        <p className="text-xl text-on-surface-variant mb-8">Bài viết này không tồn tại hoặc đã bị xóa.</p>
        <button 
          onClick={() => onBack('knowledge')}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-full font-bold hover:brightness-110 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại Kho kiến thức
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 md:px-8 max-w-3xl mx-auto">
      <button 
        onClick={() => onBack('knowledge')}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Quay lại Kho kiến thức
      </button>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <GlassCard className="p-8 md:p-10">
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mb-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="px-3 py-1 bg-primary/20 text-primary font-bold rounded-full uppercase tracking-wider">
              {post.category}
            </span>
          <span className="px-3 py-1 bg-surface-container-highest text-on-surface font-medium rounded-full uppercase tracking-wider">
            {post.postType}
          </span>
          {post.status === 'APPROVED' && (
            <span className="px-3 py-1 bg-success/20 text-success font-medium rounded-full">
              Đã duyệt
            </span>
          )}
          </motion.div>

          <motion.h1 variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }} className="text-3xl md:text-5xl font-bold text-on-surface mb-6 leading-tight">
            {post.title}
          </motion.h1>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-wrap items-center gap-6 text-on-surface-variant mb-10 pb-8 border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span className="font-medium">{post.author?.name || 'Ẩn danh'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{new Date(post.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
          </div>
        </motion.div>

          <div className="prose prose-invert max-w-none prose-lg prose-img:rounded-xl prose-img:shadow-lg prose-a:text-primary">
            {post.imageUrl && (
              <motion.div 
                variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } } }}
                className="mb-10 rounded-2xl overflow-hidden border border-outline-variant/30 shadow-2xl"
              >
                <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover" />
              </motion.div>
            )}

            {post.videoType && post.videoUrl && (
              <motion.div 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                className="mb-10 rounded-2xl overflow-hidden border border-outline-variant/30 shadow-2xl bg-black"
              >
                {post.videoType === 'URL' ? (
                  <div className="relative w-full pb-[56.25%] h-0">
                    <iframe 
                      src={getEmbedUrl(post.videoUrl)} 
                      className="absolute top-0 left-0 w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : (
                  <video src={post.videoUrl} controls className="w-full h-auto max-h-[70vh] object-contain" />
                )}
              </motion.div>
            )}

            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-on-surface-variant leading-relaxed mb-8 prose-p:my-4 prose-headings:text-on-surface"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.link && (
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mt-10 p-6 bg-surface-container-highest rounded-xl border border-outline-variant/30">
                <h3 className="text-lg font-bold text-on-surface mb-2">Liên kết tham khảo:</h3>
                <a href={post.link} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">
                  {post.link}
                </a>
              </motion.div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Bình luận */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="mt-12"
      >
        <motion.h3 variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-2xl font-bold mb-6 text-on-surface flex items-center gap-2">
          💬 Bình luận ({post.comments?.length || 0})
        </motion.h3>

        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="mb-10">
          {user ? (
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="w-full bg-surface-container border border-outline-variant/30 rounded-xl p-4 focus:outline-none focus:border-primary resize-none text-on-surface"
                rows={3}
                required
              />
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={submittingComment || !newComment.trim()}
                  className="px-6 py-2 bg-primary text-on-primary rounded-lg font-bold hover:brightness-110 transition-colors disabled:opacity-50"
                >
                  {submittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 rounded-xl bg-surface-container border border-outline-variant/30 text-center text-on-surface-variant font-medium">
              Đăng nhập để bình luận.
            </div>
          )}
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence>
            {(post.comments || []).map((comment: any) => (
              <motion.div 
                key={comment.id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden', transition: { duration: 0.2 } }}
                className="flex gap-4 p-5 rounded-xl bg-surface-container border border-outline-variant/30 relative group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary font-bold">
                  {comment.author?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-on-surface">{comment.author?.name || 'Ẩn danh'}</span>
                    {comment.author?.id === post.author?.id && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded uppercase">Tác giả</span>
                    )}
                    {comment.author?.role === 'ADMIN' && (
                      <span className="px-2 py-0.5 bg-error/20 text-error text-[10px] font-bold rounded uppercase">Admin</span>
                    )}
                    <span className="text-xs text-outline ml-auto">
                      {new Date(comment.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-on-surface-variant whitespace-pre-wrap text-sm leading-relaxed">
                    {comment.content}
                  </div>
                </div>
                {(user?.id === comment.author?.id || user?.role === 'ADMIN') && (
                  <button 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="absolute top-4 right-4 p-2 text-outline hover:text-error hover:bg-error/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Xóa bình luận"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
