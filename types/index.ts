// Tipos base para o projeto
export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
}

// Tipos para GitHub
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name?: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language?: string;
  topics: string[];
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  readme_content?: string;
  readme_error?: string;
}

// Tipos para Skills
export interface Skill {
  name: string;
  percentage: number;
  color: string;
  category?: 'frontend' | 'backend' | 'database' | 'devops' | 'other';
}

// Tipos para Projetos
export interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl: string;
  imageUrl?: string;
  highlight?: boolean;
  featured?: boolean;
}

export interface FeaturedProject extends Project {
  highlight: boolean;
  featured: true;
}

// Tipos para Timeline
export interface TimelineItem {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  type: 'work' | 'education' | 'project';
}

// Tipos para API Responses
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para Componentes
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Tipos para Cache
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Tipos para Analytics
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

// Tipos para Performance
export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  context?: Record<string, any>;
}

// Tipos para Configuração
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  cache: {
    defaultTtl: number;
    maxSize: number;
  };
  features: {
    analytics: boolean;
    errorTracking: boolean;
    performanceMonitoring: boolean;
  };
} 