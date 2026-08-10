import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches unexpected runtime errors anywhere in the tree below it and
 * shows a simple, on-brand fallback instead of an unrecoverable blank
 * white screen. Without this, a single null-reference bug in any one
 * of the site's many interactive components would take down the
 * entire page for the visitor.
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Caught by ErrorBoundary:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-foreground px-6 text-center">
          <p className="font-funnel text-3xl font-bold">
            Something went wrong.
          </p>
          <p className="text-muted-foreground max-w-sm">
            This section hit an unexpected error. Reloading usually fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-foreground text-background rounded-full hover:opacity-85 transition cursor-pointer"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
