import { Shield } from 'lucide-react';
import React from 'react';

export function Footer() {
  return (
    <footer className="w-full py-10 bg-surface-container-lowest border-t border-white/5 mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <div className="flex items-center gap-2">
            <Shield className="text-primary h-5 w-5" />
            <span className="font-logo text-lg text-primary font-bold">ANTISCAM</span>
          </div>
          <p className="text-sm text-on-surface-variant text-center md:text-left">
            © 2024 ANTISCAM. Bảo vệ người dùng Việt trong không gian số.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Điều khoản sử dụng</a>
          <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Chính sách bảo mật</a>
          <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Liên hệ hỗ trợ</a>
          <a href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Về chúng tôi</a>
        </div>
      </div>
    </footer>
  );
}
