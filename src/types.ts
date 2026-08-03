export interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  tags: string[];
  readTime?: string;
  views?: string;
  isHot?: boolean;
  isVideo?: boolean;
  duration?: string;
}

export interface StatData {
  id: string;
  label: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
  description: string;
}

export interface RecentReport {
  id: string;
  type: string;
  time: string;
  location: string;
  icon: string;
  color: string;
}

// Satisfying prompt requirement for Nodes and Edges interfaces
export interface NodeData {
  id: string;
  label: string;
  type: 'user' | 'scammer' | 'bank' | 'website';
  riskLevel: 'low' | 'medium' | 'high';
  metadata?: Record<string, any>;
}

export interface EdgeData {
  id: string;
  source: string; // NodeData ID
  target: string; // NodeData ID
  interactionType: 'transaction' | 'message' | 'visit';
  timestamp: string;
}

export type ViewType = 'home' | 'analyzer' | 'knowledge' | 'stats' | 'login' | 'register' | 'profile';
