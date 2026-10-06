import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BizSahayak Application Error Boundary caught:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen flex items-center justify-center p-6 bg-[#F5F7FA] relative overflow-hidden"
          style={{
            backgroundImage: "url('/assets/vidhan-bhawan.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        >
          {/* Subtle architectural overlay */}
          <div className="absolute inset-0 bg-[#173B72]/80 backdrop-blur-sm"></div>

          <div className="relative z-10 max-w-lg w-full bg-white/95 rounded-2xl shadow-2xl border border-slate-200 p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-[#C89B3C] flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8 text-[#C89B3C]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#173B72] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block">
                System Resilience Shield
              </span>
              <h1 className="text-2xl font-black text-[#172033]">
                Unexpected Platform Error
              </h1>
              <p className="text-xs text-[#5E6B7D] leading-relaxed">
                BizSahayak encountered a temporary rendering issue. All your session data remains safe.
                Please refresh the page to restore service.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="text-left bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono overflow-x-auto max-h-36">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-primary py-2.5 px-5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Portal
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="btn-secondary py-2.5 px-5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
