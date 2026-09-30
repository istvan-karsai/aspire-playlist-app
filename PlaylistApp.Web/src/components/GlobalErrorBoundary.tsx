import { Component, type ErrorInfo, type ReactNode } from 'react';
import { CoreUIErrors } from '../core/constants/uiText';

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
    // Log the error to an error reporting service here in the future
    console.error('Uncaught React error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-20 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-red-600">
            {CoreUIErrors.BoundaryTitle}
          </h1>
          <p className="mb-8 max-w-lg text-gray-600">{CoreUIErrors.BoundaryMessage}</p>

          {/* Diagnostic error display */}
          {this.state.error && (
            <div className="mb-8 w-full max-w-2xl overflow-auto rounded-md border border-red-200 bg-red-50 p-4 text-left shadow-sm">
              <p className="font-mono text-sm wrap-break-word text-red-800">
                {this.state.error.toString()}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
            >
              {CoreUIErrors.BoundaryRefreshPage}
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="rounded-md border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-50"
            >
              {CoreUIErrors.BoundaryBackToHome}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
