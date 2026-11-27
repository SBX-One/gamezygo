import * as React from "react";
import { FluentWifiFilledIcon } from "./Error500View";
import { EmptyState } from "@/components/ui/EmptyState";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode);
  showBackButton?: boolean;
  onReset?: () => void;
  className?: string;
  errorTitle?: string;
  errorDescription?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === "function") {
          return this.props.fallback(
            this.state.error || new Error("Unknown error"),
            this.resetError
          );
        }
        return this.props.fallback;
      }

      return (
        <div className="py-16 sm:py-24 flex items-center justify-center w-full">
          <EmptyState
            icon={<FluentWifiFilledIcon className="w-8 h-8 text-gray-50" />}
            title={this.props.errorTitle || "500: Terjadi Gangguan Server"}
            description={
              this.props.errorDescription ||
              "Terjadi kesalahan tak terduga. Silakan muat ulang halaman."
            }
            backLabel={this.props.showBackButton ? "Kembali" : ""}
            searchLabel="Muat Ulang"
            onBack={() => window.history.back()}
            onSearch={this.resetError}
            className={this.props.className}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
