'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { AnalyzerView } from './views/AnalyzerView';
import { HomeView } from './views/HomeView';
import { KnowledgeView } from './views/KnowledgeView';
import { StatsView } from './views/StatsView';

type ViewType = 'home' | 'analyzer' | 'knowledge' | 'stats';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'analyzer':
        return <AnalyzerView />;
      case 'knowledge':
        return <KnowledgeView />;
      case 'stats':
        return <StatsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/30">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}
