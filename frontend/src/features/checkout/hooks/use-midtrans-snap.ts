import * as React from "react";
import {
  MIDTRANS_SNAP_SANDBOX_URL,
  MIDTRANS_SNAP_PRODUCTION_URL,
  IS_MIDTRANS_SANDBOX,
  MIDTRANS_CLIENT_KEY,
} from "@/constants/midtrans";
import type { MidtransSnapOptions } from "@/types/midtrans";

interface UseMidtransSnapReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  openSnap: (snapToken: string, options?: MidtransSnapOptions) => void;
}

export function useMidtransSnap(): UseMidtransSnapReturn {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // 1. If window.snap is already present in browser
    if (typeof window !== "undefined" && window.snap) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    if (!MIDTRANS_CLIENT_KEY) {
      const err = "NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is missing in environment variables.";
      setError(err);
      setIsLoading(false);
      console.warn(`[Midtrans Snap]: ${err}`);
      return;
    }

    const scriptUrl = IS_MIDTRANS_SANDBOX
      ? MIDTRANS_SNAP_SANDBOX_URL
      : MIDTRANS_SNAP_PRODUCTION_URL;

    const scriptId = "midtrans-snap-sdk";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.snap) {
        setIsLoaded(true);
        setIsLoading(false);
      } else {
        existingScript.addEventListener("load", () => {
          setIsLoaded(true);
          setIsLoading(false);
        });
        existingScript.addEventListener("error", () => {
          setError("Failed to load Midtrans Snap JS SDK.");
          setIsLoading(false);
        });
      }
      return;
    }

    // 2. Inject Midtrans Snap script dynamically
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = scriptUrl;
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    script.onerror = () => {
      const errMsg = "Failed to load Midtrans Snap SDK script from CDN.";
      setError(errMsg);
      setIsLoading(false);
      console.error(`[Midtrans Snap]: ${errMsg}`);
    };

    document.body.appendChild(script);

    return () => {
      // Keep script cached in DOM across page navigations to avoid re-fetching
    };
  }, []);

  const openSnap = React.useCallback(
    (snapToken: string, options?: MidtransSnapOptions) => {
      if (typeof window === "undefined" || !window.snap) {
        console.error("[Midtrans Snap]: window.snap is not initialized yet.");
        options?.onError?.({
          status_code: "500",
          status_message: "Midtrans Snap SDK is not loaded yet.",
          transaction_id: "",
          order_id: "",
          gross_amount: "0",
          payment_type: "unknown",
          transaction_time: new Date().toISOString(),
          transaction_status: "deny",
        });
        return;
      }

      window.snap.pay(snapToken, options);
    },
    []
  );

  return {
    isLoaded,
    isLoading,
    error,
    openSnap,
  };
}
