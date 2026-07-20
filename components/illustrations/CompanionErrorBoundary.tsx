"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Isolates a companion mount so a rendering bug in the mascot never takes
 * down the surrounding page (dashboard, chat). Fails silently — the
 * companion is decorative, not load-bearing, so there is no fallback UI to
 * show, only a console log for diagnosis.
 */
export class CompanionErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Companion render error (isolated, page unaffected):", error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
