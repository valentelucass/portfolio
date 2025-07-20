'use client';

import { Component, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any): void {
    logger.error('Error Boundary caught an error', error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="text-center p-8 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Algo deu errado
                </h2>
                <p className="text-zinc-400 mb-6">
                  Ocorreu um erro inesperado. Tente recarregar a página.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => this.setState({ hasError: false })}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-medium transition-all duration-300"
                >
                  Tentar novamente
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full px-6 py-3 border border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-500 rounded-lg font-medium transition-all duration-300"
                >
                  Recarregar página
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
} 