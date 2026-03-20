import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ApiErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload(); // Or a custom reset function
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0F1115] p-6 text-center">
          <div className="max-w-md w-full bg-[#1A1D23] border border-red-500/20 rounded-[2.5rem] p-10 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">
              Connection Lost
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              We couldn't fetch the word data. Please check your internet connection and try again.
            </p>

            <button 
              onClick={this.handleReset}
              className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              <RotateCcw size={16} />
              Retry Connection
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;