import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service here in the future
    console.error("Uncaught React error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-20 text-center px-4">
          <h1 className="text-4xl font-extrabold text-red-600 mb-4">Something went wrong.</h1>
          <p className="text-gray-600 mb-8 max-w-lg">
            An unexpected error occurred in the application. Please try refreshing the page or returning home.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}