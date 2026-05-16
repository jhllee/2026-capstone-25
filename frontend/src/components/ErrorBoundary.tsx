import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import EmptyState from "./EmptyState";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="px-[18px] py-6">
          <EmptyState emoji="⚠️" title="오류가 발생했어요" subtitle="페이지를 새로고침 해주세요" />
        </div>
      );
    }
    return this.props.children;
  }
}
