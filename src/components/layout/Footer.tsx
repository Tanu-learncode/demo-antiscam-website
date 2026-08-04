import { Shield } from 'lucide-react';
import React from 'react';

export function Footer() {
  return (
    <footer className="w-full py-10 bg-surface-container-lowest border-t border-white/5 mt-auto">
      <div className="flex flex-col items-center justify-center px-6 gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Shield className="text-primary h-5 w-5" />
          <span className="font-logo text-lg text-primary font-bold">ANTISCAM</span>
        </div>
        <div className="flex flex-col items-center text-sm text-on-surface-variant text-center gap-1">
          <p>© 2026 ANTISCAM AI. All rights reserved.</p>
          <p>Developed by Team AntiScam - Dong Thap University.</p>
        </div>
      </div>
    </footer>
  );
}
