import * as React from "react";

export interface CinematicLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Callback fired once the curtain reveal is fully open and the loader completes.
   */
  onComplete?: () => void;

  /**
   * When true, disables session storage check so the opening always plays on refresh.
   * Default: true (for landing page cinematic experience).
   */
  forceShow?: boolean;

  /**
   * Optional custom class name for the root overlay.
   */
  className?: string;
}
