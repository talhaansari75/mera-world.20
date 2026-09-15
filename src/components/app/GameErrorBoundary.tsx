import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

export class GameErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    message: "",
  };

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : "Unknown application error",
    };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[Mera Word Search Journey] UI error:", error, info);
  }

  private reload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="app-shell safe-pad grid min-h-dvh place-items-center p-6">
        <section className="panel w-full max-w-md rounded-3xl p-6 text-center">
          <h1 className="font-display text-2xl text-fg">
            Mera Word Search Journey
          </h1>
          <p className="mt-3 text-sm text-muted">
            Something unexpected happened. Reload to keep your local progress.
          </p>

          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-xs font-semibold text-muted">
              Technical details
            </summary>
            <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap text-xs text-muted">
              {this.state.message}
            </pre>
          </details>

          <button
            type="button"
            onClick={this.reload}
            className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white"
          >
            Reload Game
          </button>
        </section>
      </main>
    );
  }
}
