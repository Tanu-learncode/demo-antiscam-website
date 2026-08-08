'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewType } from './types';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { AnalyzerView } from './views/AnalyzerView';
import { AuthView } from './views/AuthView';
import { HomeView } from './views/HomeView';
import { ProfileView } from './views/ProfileView';
import { KnowledgeView } from './views/KnowledgeView';
import { StatsView } from './views/StatsView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { MyPostsView } from './views/MyPostsView';
import { PostDetailView } from './views/PostDetailView';
import { SplashScreen } from './components/ui/SplashScreen';
import { motion, AnimatePresence } from 'motion/react';

// ViewType imported from src/types.ts

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [splashPhase, setSplashPhase] = useState<'intro' | 'expand' | 'done'>('intro');
  const [authTransition, setAuthTransition] = useState<{ mode: 'login' | 'register', x: number, y: number } | null>(null);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentView, selectedPostId]);

  const handleViewChange = (view: ViewType, postId?: string) => {
    setCurrentView(view);
    if (postId !== undefined) {
      setSelectedPostId(postId);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onViewChange={handleViewChange} />;
      case 'analyzer':
        return <AnalyzerView onViewChange={handleViewChange} />;
      case 'knowledge':
        return <KnowledgeView onViewDetail={(id) => handleViewChange('post_detail', id)} onViewChange={handleViewChange} />;
      case 'post_detail':
        return <PostDetailView postId={selectedPostId} onBack={handleViewChange} />;
      case 'stats':
        return <StatsView />;
      case 'login':
        return <AuthView mode="login" onModeChange={handleViewChange} />;
      case 'register':
        return <AuthView mode="register" onModeChange={handleViewChange} />;
      case 'profile':
        return <ProfileView onViewChange={handleViewChange} />;
      case 'my_posts':
        return <MyPostsView onViewDetail={(id) => handleViewChange('post_detail', id)} onBack={() => handleViewChange('profile')} />;
      case 'admin_dashboard':
      case 'admin_articles':
        return <AdminDashboardView />;
      default:
        return <HomeView onViewChange={handleViewChange} />;
    }
  };

  const isAuthView = currentView === 'login' || currentView === 'register';

  return (
    <>
      <AnimatePresence>
        {authTransition && (
          <motion.div
            initial={{ 
              clipPath: `circle(0px at ${authTransition.x}px ${authTransition.y}px)`,
              backgroundColor: '#0B1020'
            }}
            animate={{ 
              clipPath: `circle(150vw at ${authTransition.x}px ${authTransition.y}px)` 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[150] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {splashPhase !== 'done' && (
        <SplashScreen 
          onExpand={() => setSplashPhase('expand')}
          onComplete={() => setSplashPhase('done')} 
        />
      )}
      <div 
        key={splashPhase} 
        className={`min-h-screen flex flex-col font-sans selection:bg-primary/30 ${splashPhase === 'intro' ? 'opacity-0 pointer-events-none fixed inset-0' : 'opacity-100'}`}
      >
        {!isAuthView && (
          <Header 
            currentView={currentView} 
            onViewChange={setCurrentView} 
            onAuthTransition={(mode, x, y) => {
              setAuthTransition({ mode, x, y });
              setTimeout(() => {
                setCurrentView(mode);
                setAuthTransition(null);
              }, 600);
            }}
          />
        )}
        <main className={!isAuthView ? "flex-1 pt-16" : "flex-1"}>
          {renderView()}
        </main>
        {!isAuthView && <Footer />}
      </div>
    </>
  );
}
