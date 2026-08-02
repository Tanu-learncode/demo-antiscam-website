import { ArrowRight, Bookmark, PlayCircle, Search } from 'lucide-react';
import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { KNOWLEDGE_ARTICLES } from '../data';

export function KnowledgeView() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
      {/* Search Hero */}
      <section className="relative mb-12 py-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-glow-primary">Thư Viện An Toàn Không Gian Mạng</h1>
        <p className="text-on-surface-variant text-lg mb-8">Trang bị kiến thức để tự bảo vệ mình và người thân trước các chiêu trò lừa đảo trực tuyến ngày càng tinh vi.</p>
        
        <div className="w-full relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input 
            type="text" 
            className="w-full bg-surface-container-highest border border-outline-variant rounded-full py-4 pl-12 pr-32 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xl"
            placeholder="Tìm kiếm giải pháp, kiến thức bảo mật..."
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:brightness-110 transition-all">
            Tìm kiếm
          </button>
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {['Tất cả', 'Cảnh báo mới nhất', 'Cẩm nang bảo mật', 'Video hướng dẫn'].map((f, i) => (
            <button key={f} className={`px-6 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-colors ${i === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant text-sm">
          <span>Sắp xếp theo:</span>
          <select className="bg-transparent border-none focus:ring-0 font-medium text-primary cursor-pointer outline-none">
            <option>Mới nhất</option>
            <option>Xem nhiều nhất</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {KNOWLEDGE_ARTICLES.map((article, index) => {
          if (article.isHot) {
            return (
              <GlassCard key={article.id} className="lg:col-span-2 overflow-hidden group">
                <div className="flex flex-col md:flex-row h-full">
                  <div className="md:w-1/2 h-64 md:h-full relative overflow-hidden">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent md:bg-gradient-to-r"></div>
                  </div>
                  <div className="md:w-1/2 p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-error-container text-on-error-container text-xs font-bold rounded-full uppercase tracking-wider">{article.category}</span>
                      <span className="text-sm text-outline">{article.readTime}</span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4 text-primary group-hover:underline">{article.title}</h2>
                    <p className="text-on-surface-variant mb-6 line-clamp-3 text-sm">{article.excerpt}</p>
                    <button className="flex items-center gap-2 text-primary font-bold hover:underline mt-auto self-start">
                      Đọc bài viết <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          }

          if (article.isVideo) {
            return (
              <GlassCard key={article.id} className="p-5 flex flex-col group overflow-hidden">
                <div className="h-48 mb-4 rounded-lg overflow-hidden relative">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded uppercase">Video</span>
                  <span className="text-xs text-outline">{article.duration}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                <div className="flex justify-between items-center mt-auto">
                   <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">AS</div>
                   <span className="text-sm text-outline">{article.views} lượt xem</span>
                </div>
              </GlassCard>
            )
          }

          return (
            <GlassCard key={article.id} className="p-5 flex flex-col group">
              <div className="h-40 mb-4 rounded-lg overflow-hidden relative">
                 <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <span className="text-sm font-medium text-primary mb-2">{article.category}</span>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">{article.title}</h3>
              <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">{article.excerpt}</p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex gap-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10">{tag}</span>
                  ))}
                </div>
                <button className="text-outline hover:text-primary transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
      
      <div className="mt-12 flex justify-center">
        <button className="px-8 py-3 border border-primary text-primary rounded-full font-bold hover:bg-primary hover:text-on-primary transition-all flex items-center gap-2">
          Xem thêm bài viết
        </button>
      </div>
    </div>
  );
}
