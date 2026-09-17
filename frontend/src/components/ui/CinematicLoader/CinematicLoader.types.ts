import * as React from "react";

export interface CinematicLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Callback fired once the curtain reveal is fully open and the loader completes.
   */
  onComplete?: () => void;

  /**
   * When true, disables session storage check so the opening always plays.
   * Default: false (plays once per browser session; subsequent page switches skip loading).
   */
  forceShow?: boolean;

  /**
   * Optional custom class name for the root overlay.
   */
  className?: string;
}
