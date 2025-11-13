import React, { Component } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h1
            style={{ fontSize: "2rem", marginBottom: "1rem", color: "#e53e3e" }}
          >
            Oops! Something went wrong
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "2rem",
              color: "#4a5568",
            }}
          >
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 24px",
              fontSize: "1rem",
              backgroundColor: "#1a73e8",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: "2rem", textAlign: "left" }}>
              <summary style={{ cursor: "pointer", color: "#718096" }}>
                Error Details (Development Only)
              </summary>
              <pre
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f7fafc",
                  borderRadius: "4px",
                  overflow: "auto",
                  fontSize: "0.875rem",
                }}
              >
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
