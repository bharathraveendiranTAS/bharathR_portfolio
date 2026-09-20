import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary [${this.props.name || 'Root'}] caught an error:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: '#070a12',
            color: '#f1f5f9',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              padding: '32px',
              borderRadius: '16px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(0, 229, 255, 0.25)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>⚡</div>
            <h1
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#00e5ff',
                marginBottom: '12px',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              Session Initialized
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              The application encountered a transient initialization check. Click below to refresh the interactive workspace.
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                padding: '12px 28px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #00e5ff 0%, #3b82f6 100%)',
                color: '#070a12',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.85rem',
              }}
            >
              RELOAD WORKSPACE
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
