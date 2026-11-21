import { Component } from 'preact';

/**
 * ErrorBoundary - Civic error boundary that catches UI crashes and presents
 * an accessible fallback interface with recovery options.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error internally without transmitting external telemetry
    if (typeof console !== 'undefined' && console.error) {
      console.error('SchemeSetu ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = '#/';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div class="min-h-[50vh] flex items-center justify-center p-6 text-center">
          <div class="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-lg space-y-4">
            <div class="text-4xl" aria-hidden="true">⚠️</div>
            <h1 class="text-xl font-bold text-gray-900">Something went wrong</h1>
            <p class="text-sm text-gray-600">
              SchemeSetu encountered an unexpected issue while rendering this page. Your saved data is safe.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              class="w-full py-3 px-4 bg-[#FF9933] hover:bg-[#e67300] text-white font-bold text-sm rounded-xl shadow transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9933]"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
