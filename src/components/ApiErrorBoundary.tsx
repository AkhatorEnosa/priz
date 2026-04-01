import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ShieldAlert } from 'lucide-react';

  interface Props { 
    children: ReactNode; 
  }

  interface State { 
    hasError: boolean; 
    error: Error | null; 
    isApiError: boolean; // New flag to distinguish error types
  }

  class ApiErrorBoundary extends Component<Props, State> {
    public state: State = { 
      hasError: false, 
      error: null, 
      isApiError: false 
    };

  public static getDerivedStateFromError(error: Error): State {
    // We check if it's a network error or a custom API error
    // Note: You can check for 'TypeError: Failed to fetch' or a custom class
    const isApi = 
      error.name === 'ApiError' || 
      error.message.includes('fetch') || 
      error.message.includes('NetworkError');

    return { hasError: true, error, isApiError: isApi };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Boundary caught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, isApiError: false });
    // If it's a code crash, a reload is safer. 
    // If it's just a fetch fail, you might just want to trigger a re-render.
    window.location.reload(); 
  };

  public render() {
    if (this.state.hasError) {
      const { isApiError } = this.state;

      return (
        <div className="fixed inset-0 z-300 flex items-center justify-center bg-[#0F1115] p-6 text-center">
          <div className={`max-w-md w-full bg-[#1A1D23] border ${isApiError ? 'border-amber-500/20' : 'border-red-500/20'} rounded-[2.5rem] p-10 shadow-2xl`}>
            
            {/* Dynamic Icon based on error type */}
            <div className={`w-16 h-16 ${isApiError ? 'bg-amber-500/10' : 'bg-red-500/10'} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
              {isApiError ? (
                <AlertTriangle className="text-amber-500" size={32} />
              ) : (
                <ShieldAlert className="text-red-500" size={32} />
              )}
            </div>
            
            {/* Dynamic Text */}
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
              {isApiError ? "Connection Lost" : "App Encountered a Snag"}
            </h2>
            
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              {isApiError 
                ? "We couldn't fetch the data. Please check your internet connection and try again."
                : "A technical error occurred within the application. We've been notified and are looking into it."}
            </p>

            <button 
              onClick={this.handleReset}
              className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              <RotateCcw size={16} />
              {isApiError ? "Retry Connection" : "Reload Application"}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;