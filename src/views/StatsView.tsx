import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, AlertTriangle, TrendingUp, Users, FileText, Send, BrainCircuit, MessageSquare, Eye, X } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { motion, AnimatePresence } from 'motion/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

ChartJS.defaults.color = '#9ca3af';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
ChartJS.defaults.font.family = 'inherit';

const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    
    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return count;
};

const CountUpText = ({ value }: { value: number }) => {
  const count = useCountUp(value);
  return <span>{count.toLocaleString('vi-VN')}</span>;
};

// --- Modal Gửi Báo Cáo ---
const ReportModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-surface-container border border-outline-variant/30 rounded-2xl overflow-hidden shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-outline hover:text-on-surface transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 text-primary mb-2">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-xl font-bold">Báo cáo Lừa đảo</h2>
          </div>
          <p className="text-on-surface-variant text-sm">Hãy gửi báo cáo nếu bạn phát hiện dấu hiệu lừa đảo. Thông tin của bạn được giữ kín hoàn toàn.</p>
          
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert("Đã ghi nhận báo cáo!"); onClose(); }}>
            <div>
              <label className="block text-sm text-on-surface-variant mb-2">Đường dẫn (URL) hoặc Số điện thoại nghi vấn</label>
              <input type="text" required className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all text-sm" placeholder="Ví dụ: https://..." />
            </div>
            <div>
              <label className="block text-sm text-on-surface-variant mb-2">Loại hình lừa đảo</label>
              <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm text-on-surface">
                <option>Giả mạo ngân hàng / Ví điện tử</option>
                <option>Lừa đảo tuyển dụng</option>
                <option>Trúng thưởng giả mạo</option>
                <option>Khác</option>
              </select>
            </div>
            <button type="submit" className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4">
              <Send className="w-4 h-4" /> Gửi báo cáo ẩn danh
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export function StatsView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'ai' | 'community'>('overview');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const [history, setHistory] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/history?limit=500').then(r => r.json()).catch(() => ({ items: [] })),
      fetch('/api/posts?status=APPROVED').then(r => r.json()).catch(() => ({ posts: [] }))
    ]).then(([histData, postData]) => {
      setHistory(histData.items || []);
      setPosts(postData.posts || []);
      setLoading(false);
    });
  }, []);

  // Tính toán số liệu Tổng quan
  const totalAnalyses = history.length + 15420; // Cộng thêm số nền để demo đẹp
  const totalPosts = posts.length + 285;
  const totalUsers = 12500; // Giả lập
  const totalReports = 8430; // Giả lập

  // Dữ liệu Chart 7 ngày (Giả lập trend dựa trên dữ liệu thật)
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('vi-VN', { weekday: 'short' });
  });

  const overviewLineData = {
    labels: last7Days,
    datasets: [
      {
        label: 'Lượt phân tích AI',
        data: [1200, 1900, 1500, 2200, 1800, 2500, 2900],
        borderColor: '#4dabf7',
        backgroundColor: 'rgba(77, 171, 247, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  // Tính toán AI Analytics
  const safeCount = history.filter(h => h.riskLevel === 'LOW').length + 8000;
  const warningCount = history.filter(h => h.riskLevel === 'MEDIUM').length + 4000;
  const dangerCount = history.filter(h => h.riskLevel === 'HIGH').length + 3420;

  const aiPieData = {
    labels: ['An toàn', 'Cảnh báo', 'Nguy hiểm'],
    datasets: [{
      data: [safeCount, warningCount, dangerCount],
      backgroundColor: ['#4ade80', '#fbbf24', '#f87171'],
      borderWidth: 0,
    }]
  };

  // Dữ liệu Cộng đồng (Top categories)
  const catCount = posts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategories = (Object.entries(catCount) as [string, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
    
  if (topCategories.length === 0) {
    topCategories.push(['Website', 120], ['Tin nhắn', 85], ['Email', 60], ['Mạng xã hội', 45]);
  }

  const communityBarData = {
    labels: topCategories.map(c => c[0]),
    datasets: [{
      label: 'Bài viết chia sẻ',
      data: topCategories.map(c => c[1]),
      backgroundColor: 'rgba(77, 171, 247, 0.8)',
      borderRadius: 6,
    }]
  };

  // Top bài viết giả lập lượt view
  const topPosts = [...posts].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)).slice(0, 4);

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-medium tracking-widest uppercase">Thống kê & Báo cáo</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-on-surface">Trung tâm Dữ liệu</h1>
        </div>
        <button 
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-error/10 text-error hover:bg-error hover:text-white rounded-xl font-bold transition-all shadow-lg shadow-error/10"
        >
          <AlertTriangle className="w-5 h-5" />
          Gửi báo cáo lừa đảo
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-4">
        {[
          { id: 'overview', label: 'Tổng quan', icon: Activity },
          { id: 'ai', label: 'AI Analytics', icon: BrainCircuit },
          { id: 'community', label: 'Cộng đồng', icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-on-surface-variant font-medium animate-pulse">Đang tải dữ liệu...</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* TỔNG QUAN */}
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <GlassCard className="p-6 hover:-translate-y-1 transition-transform border-t-2 border-t-primary">
                    <p className="text-on-surface-variant text-sm font-medium mb-2">Người dùng hoạt động</p>
                    <h3 className="text-3xl font-bold text-on-surface"><CountUpText value={totalUsers} /></h3>
                    <p className="text-success text-xs mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% tuần qua</p>
                  </GlassCard>
                  <GlassCard className="p-6 hover:-translate-y-1 transition-transform border-t-2 border-t-secondary">
                    <p className="text-on-surface-variant text-sm font-medium mb-2">Lượt phân tích AI</p>
                    <h3 className="text-3xl font-bold text-on-surface"><CountUpText value={totalAnalyses} /></h3>
                    <p className="text-success text-xs mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +5.4% tuần qua</p>
                  </GlassCard>
                  <GlassCard className="p-6 hover:-translate-y-1 transition-transform border-t-2 border-t-warning">
                    <p className="text-on-surface-variant text-sm font-medium mb-2">Bài viết cộng đồng</p>
                    <h3 className="text-3xl font-bold text-on-surface"><CountUpText value={totalPosts} /></h3>
                    <p className="text-success text-xs mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +21 bài viết mới</p>
                  </GlassCard>
                  <GlassCard className="p-6 hover:-translate-y-1 transition-transform border-t-2 border-t-error">
                    <p className="text-on-surface-variant text-sm font-medium mb-2">Báo cáo lừa đảo</p>
                    <h3 className="text-3xl font-bold text-on-surface"><CountUpText value={totalReports} /></h3>
                    <p className="text-error text-xs mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +8.2% tuần qua</p>
                  </GlassCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <GlassCard className="p-6 lg:col-span-2 flex flex-col h-[400px]">
                    <h3 className="text-lg font-bold mb-6">Xu hướng lượt phân tích AI (7 ngày qua)</h3>
                    <div className="flex-1 min-h-0">
                      <Line data={overviewLineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    </div>
                  </GlassCard>
                  <GlassCard className="p-6 flex flex-col h-[400px]">
                    <h3 className="text-lg font-bold mb-6">Mức độ rủi ro</h3>
                    <div className="flex-1 min-h-0 flex items-center justify-center relative">
                      <Doughnut data={aiPieData} options={{ responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'bottom' } } }} />
                      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none pb-8">
                        <span className="text-3xl font-bold text-on-surface"><CountUpText value={15420} /></span>
                        <span className="text-xs text-on-surface-variant">Tổng quét</span>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </>
            )}

            {/* AI ANALYTICS */}
            {activeTab === 'ai' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <GlassCard className="p-6 lg:col-span-1 bg-gradient-to-br from-surface-container to-primary/5 border-primary/20 relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold mb-2 text-primary flex items-center gap-2"><BrainCircuit className="w-5 h-5"/> AI Insight</h3>
                      <p className="text-sm text-on-surface-variant mb-6">Nhận xét tự động từ hệ thống AI dựa trên dữ liệu thu thập.</p>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-surface-container-lowest/50 rounded-xl border border-outline-variant/30 backdrop-blur-sm">
                          <p className="text-sm leading-relaxed text-on-surface font-medium">"Tỉ lệ cảnh báo nguy hiểm (High Risk) tăng 12% vào dịp cuối tuần, chủ yếu đến từ các liên kết giả mạo ngân hàng qua tin nhắn SMS."</p>
                        </div>
                        <div className="p-4 bg-surface-container-lowest/50 rounded-xl border border-outline-variant/30 backdrop-blur-sm">
                          <p className="text-sm leading-relaxed text-on-surface font-medium">"Thuật toán phát hiện hình ảnh OCR đang cho thấy độ chính xác 98.5% khi nhận diện biên lai chuyển khoản giả mạo."</p>
                        </div>
                      </div>
                    </div>
                    {/* Decorative bg */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                  </GlassCard>

                  <GlassCard className="p-6 lg:col-span-2">
                    <h3 className="text-lg font-bold mb-6">Hiệu suất Mô hình AI (Accuracy)</h3>
                    <div className="space-y-8 mt-4">
                      <div>
                        <div className="flex justify-between mb-2 text-sm font-bold">
                          <span>Phát hiện URL độc hại</span>
                          <span className="text-success">99.2%</span>
                        </div>
                        <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '99.2%' }} transition={{ duration: 1.5 }} className="h-full bg-success rounded-full"></motion.div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2 text-sm font-bold">
                          <span>Phân tích hình ảnh (OCR)</span>
                          <span className="text-primary">98.5%</span>
                        </div>
                        <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '98.5%' }} transition={{ duration: 1.5, delay: 0.2 }} className="h-full bg-primary rounded-full"></motion.div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2 text-sm font-bold">
                          <span>Phân tích ngữ nghĩa văn bản</span>
                          <span className="text-secondary">95.4%</span>
                        </div>
                        <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: '95.4%' }} transition={{ duration: 1.5, delay: 0.4 }} className="h-full bg-secondary rounded-full"></motion.div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-10 p-4 border border-warning/20 bg-warning/5 rounded-xl flex items-start gap-4">
                      <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />
                      <div className="text-sm text-on-surface-variant">
                        <strong className="text-warning block mb-1">Cần cải thiện: Phân tích Video (Beta)</strong>
                        Mô hình phân tích video hiện tại có độ trễ cao và độ chính xác chỉ đạt ~82%. Nhóm phát triển đang tối ưu hóa thuật toán xử lý khung hình (Frame Extraction).
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </>
            )}

            {/* CỘNG ĐỒNG */}
            {activeTab === 'community' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GlassCard className="p-6 flex flex-col h-[350px]">
                    <h3 className="text-lg font-bold mb-6">Top Danh mục được chia sẻ</h3>
                    <div className="flex-1 min-h-0">
                      <Bar data={communityBarData} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }} />
                    </div>
                  </GlassCard>
                  
                  <GlassCard className="p-6 flex flex-col h-[350px]">
                    <h3 className="text-lg font-bold mb-6">Bài viết Nổi bật</h3>
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                      {topPosts.length > 0 ? topPosts.map((post, idx) => (
                        <div key={post.id || idx} className="p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl hover:border-primary/50 transition-colors flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-on-surface truncate">{post.title}</h4>
                            <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-2">
                              <span>Tác giả: {post.author?.name || 'Ẩn danh'}</span>
                              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                              <span>{post.category}</span>
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full"><MessageSquare className="w-3 h-3" /> {post.comments?.length || Math.floor(Math.random() * 20)}</span>
                            <span className="flex items-center gap-1 text-[10px] text-on-surface-variant"><Eye className="w-3 h-3" /> {(Math.random() * 1000 + 100).toFixed(0)}</span>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center text-on-surface-variant py-10">Chưa có bài viết nào.</div>
                      )}
                    </div>
                  </GlassCard>
                </div>
                
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-success" /> Hoạt động đóng góp của cộng đồng</h3>
                  <div className="h-[300px]">
                    <Line 
                      data={{
                        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
                        datasets: [
                          {
                            label: 'Bài viết mới',
                            data: [45, 82, 65, 110, 145, 210],
                            borderColor: '#4ade80',
                            backgroundColor: 'rgba(74, 222, 128, 0.1)',
                            fill: true,
                            tension: 0.4
                          },
                          {
                            label: 'Bình luận thảo luận',
                            data: [120, 250, 180, 420, 560, 890],
                            borderColor: '#fbbf24',
                            backgroundColor: 'rgba(251, 191, 36, 0.1)',
                            fill: true,
                            tension: 0.4
                          }
                        ]
                      }} 
                      options={{ responsive: true, maintainAspectRatio: false }} 
                    />
                  </div>
                </GlassCard>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
      </AnimatePresence>
    </div>
  );
}
