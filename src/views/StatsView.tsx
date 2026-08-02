import { Activity, AlertCircle, AlertTriangle, Building2, ChevronRight, Filter, Link as LinkIcon, Phone, Send, ShieldCheck, Smartphone, TrendingUp, Wallet } from 'lucide-react';
import React from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { RECENT_REPORTS, STAT_DATA } from '../data';

// Map string icon names to Lucide components
const IconMap: Record<string, React.ElementType> = {
  AlertTriangle,
  ShieldCheck,
  Smartphone,
  Wallet,
  AlertCircle,
  Link: LinkIcon,
  Phone
};

export function StatsView() {
  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-10">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Activity className="w-5 h-5" />
          <span className="text-sm font-medium tracking-widest uppercase">Trung tâm dữ liệu</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Tình hình lừa đảo trực tuyến tại Việt Nam</h1>
        <p className="text-on-surface-variant max-w-2xl text-sm md:text-base">Dữ liệu được cập nhật theo thời gian thực từ các báo cáo cộng đồng và hệ thống quét AI chủ động.</p>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_DATA.map((stat) => {
          const IconComponent = IconMap[stat.icon];
          const colorClass = 
            stat.color === 'primary' ? 'text-primary bg-primary/10' : 
            stat.color === 'success' ? 'text-success bg-success/10' : 
            'text-on-surface-variant bg-surface-variant';
            
          const textValueColor = 
            stat.color === 'primary' ? 'text-primary' : 
            stat.color === 'success' ? 'text-success' : 
            'text-on-surface';

          return (
            <GlassCard key={stat.id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-on-surface-variant text-sm mb-1">{stat.label}</p>
                  <h3 className={`text-2xl font-bold ${textValueColor}`}>{stat.value}</h3>
                </div>
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  {IconComponent && <IconComponent className="w-5 h-5" />}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                {stat.trendDirection === 'up' && <TrendingUp className="w-4 h-4 text-error" />}
                {stat.trendDirection === 'neutral' && <div className="w-2 h-2 bg-success rounded-full pulse-safe"></div>}
                <span className={stat.trendDirection === 'up' ? 'text-error' : stat.trendDirection === 'neutral' ? 'text-success' : 'text-on-surface-variant'}>
                  {stat.trend || stat.description}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </section>

      {/* Main Analytics Area */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Mock */}
        <GlassCard className="lg:col-span-2 flex flex-col h-[500px] p-0 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <div>
              <h4 className="text-lg font-semibold">Bản đồ nhiệt khu vực bị tấn công</h4>
              <p className="text-on-surface-variant text-xs">Dữ liệu được phân bổ theo địa lý tại Việt Nam</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-variant rounded-lg text-sm hover:bg-surface-bright transition-colors">
              <Filter className="w-4 h-4" />
              Lọc khu vực
            </button>
          </div>
          <div className="flex-1 relative bg-surface-container-lowest/50 m-6 rounded-lg overflow-hidden border border-white/5">
             {/* Map Graphic Simulation */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800')] bg-cover bg-center opacity-20 grayscale"></div>
             
             {/* Heat spots */}
             <div className="absolute top-1/4 left-1/2 w-32 h-32 bg-error/20 rounded-full blur-3xl animate-pulse"></div>
             <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-primary/20 rounded-full blur-3xl"></div>
             
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center bg-surface/80 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                  <Building2 className="text-primary w-8 h-8 mx-auto mb-2 opacity-80" />
                  <p className="text-primary font-bold">HÀ NỘI & TP.HCM</p>
                  <p className="text-on-surface-variant text-xs">Vùng rủi ro mức 5 (Cao nhất)</p>
                </div>
             </div>
          </div>
        </GlassCard>

        {/* Trends & List */}
        <GlassCard className="flex flex-col h-[500px] p-0">
          <div className="p-6 border-b border-white/10">
            <h4 className="text-lg font-semibold">Biến động thời gian thực</h4>
          </div>
          <div className="p-6 flex-1 space-y-6 overflow-y-auto custom-scrollbar">
            {/* Chart Mock */}
            <div className="h-32 bg-surface-container-lowest rounded-lg border border-white/5 relative flex items-end px-2 py-4 gap-1">
              {[40, 60, 45, 85, 55, 70, 30, 50].map((h, i) => (
                <div key={i} className={`w-full rounded-t-sm ${h === 85 ? 'bg-primary' : 'bg-primary/40'}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-on-surface-variant text-xs uppercase tracking-wider font-medium">Báo cáo gần đây</p>
              <div className="space-y-3">
                {RECENT_REPORTS.map((report) => {
                  const Icon = IconMap[report.icon];
                  return (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-surface-container/50 rounded-lg hover:bg-surface-container transition-all cursor-pointer border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${report.color}`}>
                          {Icon && <Icon className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{report.type}</p>
                          <p className="text-on-surface-variant text-[10px]">{report.time} - {report.location}</p>
                        </div>
                      </div>
                      <ChevronRight className="text-on-surface-variant w-4 h-4" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </GlassCard>
      </section>
      
      {/* Report Form */}
      <GlassCard className="overflow-hidden p-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-10 space-y-6">
            <h2 className="text-2xl font-bold">Gửi báo cáo mới</h2>
            <p className="text-on-surface-variant text-sm">Bạn vừa phát hiện một dấu hiệu lừa đảo? Hãy gửi báo cáo ngay để chúng tôi phân tích và cảnh báo cộng đồng.</p>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="block text-sm text-on-surface-variant mb-2">Đường dẫn (URL) hoặc Số điện thoại nghi vấn</label>
                <input type="text" className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary transition-all text-sm" placeholder="https://example-scam.com" />
              </div>
              <div>
                <label className="block text-sm text-on-surface-variant mb-2">Loại hình lừa đảo</label>
                <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary text-sm text-on-surface">
                  <option>Giả mạo ngân hàng / Ví điện tử</option>
                  <option>Lừa đảo tuyển dụng</option>
                  <option>Khác</option>
                </select>
              </div>
              <button className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Gửi báo cáo ẩn danh
              </button>
            </form>
          </div>
          <div className="hidden md:block relative bg-surface-container-high/30">
             <div className="absolute inset-0 p-10 flex flex-col justify-center items-center text-center space-y-4 z-10">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                  <ShieldCheck className="text-primary w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold">Bảo mật thông tin</h4>
                <p className="text-on-surface-variant text-sm max-w-xs">Thông tin của bạn được mã hóa hoàn toàn. Chúng tôi không bao giờ chia sẻ danh tính người báo cáo.</p>
             </div>
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800')] bg-cover bg-center opacity-10 mix-blend-screen"></div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
