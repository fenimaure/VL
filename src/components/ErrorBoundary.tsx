import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-8 bg-red-50 text-red-900 overflow-auto">
                    <h1 className="text-3xl font-bold mb-4 text-red-700">Application Error</h1>
                    <p className="mb-6 text-lg">Something went wrong while rendering the application.</p>

                    <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-xl border border-red-200 overflow-x-auto mb-8">
                        <h3 className="font-bold text-red-800 mb-2 font-mono text-sm uppercase tracking-wide">Error Message:</h3>
                        <pre className="font-mono text-sm text-red-600 mb-4 whitespace-pre-wrap break-words">
                            {this.state.error?.message || 'Unknown error'}
                        </pre>

                        {this.state.error?.stack && (
                            <>
                                <h3 className="font-bold text-gray-700 mb-2 font-mono text-sm uppercase tracking-wide border-t border-gray-100 pt-4">Stack Trace:</h3>
                                <pre className="font-mono text-xs text-gray-600 whitespace-pre overflow-x-auto">
                                    {this.state.error.stack}
                                </pre>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
                    >
                        <span>Reload Page</span>
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
