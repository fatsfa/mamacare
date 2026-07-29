import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-4 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">⚠️ Oops!</h1>
            <p className="text-gray-700 mb-4">Something went wrong. Please try refreshing the page.</p>
            <p className="text-sm text-gray-500 mb-4">Error: {this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
