'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

// ViewType imported from src/types.ts

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/30">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 pt-16">{/* Reserve nav height */}
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}
