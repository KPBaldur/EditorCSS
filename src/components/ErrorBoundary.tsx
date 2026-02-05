import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
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
                <div className="p-8 text-red-500 bg-gray-900 h-screen font-mono overflow-auto">
                    <h1 className="text-2xl font-bold mb-4">React Error Captured</h1>
                    <p className="mb-4 text-xl">{this.state.error?.message}</p>
                    <pre className="text-sm bg-black p-4 rounded border border-red-900/50 block w-full whitespace-pre-wrap">
                        {this.state.error?.stack}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
