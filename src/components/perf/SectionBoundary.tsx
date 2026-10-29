import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  label: string;
};

type State = {
  hasError: boolean;
};

export class SectionBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error(`Six Bullets section failed: ${this.props.label}`, error, info.componentStack);
    }
  }

  private retry = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <section
        aria-label={`${this.props.label} unavailable`}
        className="flex min-h-[320px] items-center justify-center px-6 py-20"
      >
        <div className="max-w-sm text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/55">
            Section unavailable
          </p>
          <p className="mt-3 font-display text-3xl uppercase tracking-[-0.02em] text-ink">
            {this.props.label}
          </p>
          <button
            type="button"
            onClick={this.retry}
            className="mt-6 border border-ink/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink hover:bg-ink/5"
          >
            Reload page
          </button>
        </div>
      </section>
    );
  }
}
