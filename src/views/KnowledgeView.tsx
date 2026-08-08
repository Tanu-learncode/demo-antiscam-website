import { ArrowRight, Bookmark, PlayCircle, Search, PlusCircle, Users, BookOpen, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { CreatePostModal } from '../components/ui/CreatePostModal';
import { LoginPromptModal } from '../components/ui/LoginPromptModal';
import { motion, AnimatePresence } from 'motion/react';

export function KnowledgeView({ onViewDetail, onViewChange }: { onViewDetail?: (id: string) => void, onViewChange?: (view: any) => void }) {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'community'>('knowledge');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [knowledgePosts, setKnowledgePosts] = useState<any[]>([]);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/posts?status=APPROVED')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          const admin = data.posts.filter((p: any) => p.section === 'KNOWLEDGE');
          const users = data.posts.filter((p: any) => p.section === 'COMMUNITY');
          setKnowledgePosts(admin);
          setCommunityPosts(users);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    let mounted = true;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (mounted && data.user) setCurrentUser(data.user);
      })
      .catch(() => {});

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleUserUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.userId) {
        const updateAuthor = (p: any) => 
          p.author?.id === detail.userId 
            ? { ...p, author: { ...p.author, avatar: detail.avatar } } 
            : p;
        
        setKnowledgePosts(prev => prev.map(updateAuthor));
        setCommunityPosts(prev => prev.map(updateAuthor));
      }
    };
    window.addEventListener('user-updated', handleUserUpdate);
    return () => window.removeEventListener('user-updated', handleUserUpdate);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setDebouncedQuery(searchQuery);
    setIsSearching(false);
  };

  const handleOpenCreatePost = async () => {
    let user = currentUser;
    if (!user) {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        const data = await res.json();
        if (data.user) {
          user = data.user;
          setCurrentUser(user);
        }
      } catch (e) {}
    }
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setIsModalOpen(true);
  };

  const filterPosts = (posts: any[]) => {
    if (!debouncedQuery.trim()) return posts;
    const q = debouncedQuery.toLowerCase();
    return posts.filter(post => 
      post.title?.toLowerCase().includes(q) ||
      post.content?.toLowerCase().includes(q) ||
      post.category?.toLowerCase().includes(q) ||
      post.author?.name?.toLowerCase().includes(q)
    );
  };

  const filteredKnowledge = filterPosts(knowledgePosts);
  const filteredCommunity = filterPosts(communityPosts);

  const getYoutubeThumbnail = (url: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      try {
        videoId = new URL(url).searchParams.get('v') || '';
      } catch (e) {}
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    
    if (videoId) return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    return null;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6 } 
    }
  };

  const renderPostCard = (post: any) => (
    <motion.div
      key={post.id}
      variants={cardVariants}
      whileHover={{ y: -6, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
      transition={{ type: "tween", duration: 0.25 }}
      className="h-full"
    >
      <GlassCard 
        className="h-full p-5 flex flex-col group cursor-pointer hover:border-primary/50 transition-all"
        onClick={() => onViewDetail && onViewDetail(post.id)}
      >
        {post.imageUrl ? (
          <div className="h-40 mb-4 rounded-lg overflow-hidden relative border border-outline-variant/30 flex-shrink-0">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        ) : post.videoType && post.videoUrl ? (
          <div className="h-40 mb-4 rounded-lg overflow-hidden relative border border-outline-variant/30 flex-shrink-0 bg-black flex items-center justify-center">
            {post.videoType === 'URL' && getYoutubeThumbnail(post.videoUrl) ? (
              <img src={getYoutubeThumbnail(post.videoUrl)!} alt="Video Thumbnail" className="w-full h-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" />
            ) : post.videoType === 'UPLOAD' ? (
              <video src={post.videoUrl} className="w-full h-full object-cover opacity-60" />
            ) : (
              <div className="w-full h-full bg-surface-container-highest opacity-60" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-white opacity-90 group-hover:scale-110 transition-transform drop-shadow-lg" />
            </div>
            <div className="absolute top-2 left-2 bg-error/90 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 shadow">
              <PlayCircle className="w-3 h-3" /> VIDEO
            </div>
          </div>
        ) : null}
        <span className="text-sm font-medium text-primary mb-2">{post.category}</span>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-on-surface-variant text-sm mb-6 line-clamp-3">
          {post.summary || (post.content ? post.content.replace(/<[^>]+>/g, '') : '')}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                {post.author?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <span className="text-xs text-outline font-medium">{post.author?.name || 'Ẩn danh'}</span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      {/* Search Hero */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
        className="relative mb-8 py-8 text-center max-w-3xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-glow-primary">Kho kiến thức</h1>
        <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
          Khám phá kiến thức, chia sẻ kinh nghiệm <br className="hidden sm:block" /> và cập nhật cảnh báo lừa đảo trực tuyến mới nhất.
        </p>
        
        <form onSubmit={handleSearchSubmit} className="w-full relative max-w-2xl mx-auto">
          {isSearching ? (
            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5 animate-spin" />
          ) : (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          )}
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-highest border border-outline-variant rounded-full py-4 pl-12 pr-32 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xl"
            placeholder="Tìm kiếm theo tiêu đề, nội dung, danh mục, tác giả..."
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:brightness-110 transition-all">
            Tìm kiếm
          </button>
        </form>
      </motion.section>

      {/* Tabs & Actions */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-outline-variant/30 pb-4"
      >
        <div className="flex items-center gap-6">
          <motion.button 
            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
            type="button"
            onClick={() => setActiveTab('knowledge')}
            className={`flex items-center gap-2 font-bold text-lg pb-4 -mb-[17px] border-b-2 transition-colors ${activeTab === 'knowledge' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-on-surface'}`}
          >
            <BookOpen className="w-5 h-5" />
            Kiến thức
          </motion.button>
          <motion.button 
            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
            type="button"
            onClick={() => setActiveTab('community')}
            className={`flex items-center gap-2 font-bold text-lg pb-4 -mb-[17px] border-b-2 transition-colors ${activeTab === 'community' ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:text-on-surface'}`}
          >
            <Users className="w-5 h-5" />
            Cộng đồng
          </motion.button>
        </div>
        
        <motion.button 
          variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.25 }}
          onClick={handleOpenCreatePost}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary font-bold rounded-full hover:brightness-110 active:scale-95 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Chia sẻ bài viết
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="py-20 text-center text-on-surface-variant animate-pulse font-medium">
          Đang tải dữ liệu...
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + debouncedQuery}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, amount: 0.1 }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
            }}
          >
            {activeTab === 'knowledge' ? (
              <>
                {knowledgePosts.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <BookOpen className="w-16 h-16 text-primary/30 mb-4" />
                    <h2 className="text-2xl font-bold text-on-surface mb-2">Chưa có bài viết.</h2>
                    <p className="text-on-surface-variant max-w-md mx-auto mb-6">Khi có bài viết được đăng hoặc được quản trị viên duyệt, nội dung sẽ hiển thị tại đây.</p>
                  </div>
                ) : filteredKnowledge.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <Search className="w-16 h-16 text-primary/30 mb-4" />
                    <h2 className="text-2xl font-bold text-on-surface mb-2">Không tìm thấy bài viết phù hợp.</h2>
                    <p className="text-on-surface-variant max-w-md mx-auto mb-6">Thử sử dụng từ khóa khác.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredKnowledge.map(renderPostCard)}
                  </div>
                )}
              </>
            ) : (
              <>
                {communityPosts.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <Users className="w-16 h-16 text-primary/30 mb-4" />
                    <h2 className="text-2xl font-bold text-on-surface mb-2">Chưa có bài viết cộng đồng nào.</h2>
                    <p className="text-on-surface-variant max-w-md mx-auto mb-6">Khi có bài viết được đăng hoặc được quản trị viên duyệt, nội dung sẽ hiển thị tại đây. Hãy là người đầu tiên chia sẻ kinh nghiệm!</p>
                    <motion.button 
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.25 }}
                      onClick={handleOpenCreatePost}
                      className="px-6 py-2 bg-primary/20 text-primary font-bold rounded-full hover:bg-primary/30 transition-colors"
                    >
                      Chia sẻ ngay
                    </motion.button>
                  </div>
                ) : filteredCommunity.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <Search className="w-16 h-16 text-primary/30 mb-4" />
                    <h2 className="text-2xl font-bold text-on-surface mb-2">Không tìm thấy bài viết phù hợp.</h2>
                    <p className="text-on-surface-variant max-w-md mx-auto mb-6">Thử sử dụng từ khóa khác.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommunity.map(renderPostCard)}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <LoginPromptModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
        onConfirm={() => { if (onViewChange) onViewChange('login'); }}
        message="Vui lòng đăng nhập để chia sẻ bài viết cùng cộng đồng."
      />
    </div>
  );
}
