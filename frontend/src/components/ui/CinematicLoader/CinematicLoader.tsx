import * as React from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import type { CinematicLoaderProps } from "./CinematicLoader.types";

/**
 * Gamezygo Brand Emblem SVG
 */
const GamezygoEmblem = ({
  className,
  fill,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="45"
    height="24"
    viewBox="0 0 45 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    {...props}
  >
    <path
      d="M0 24L17.7974 0H45L40.8762 4.18018H21.1978L8.46463 20.9009H16.3505L24.8875 12.6126L16.3505 14.7027L20.1849 9.22523H35.0161L22.4277 24H0Z"
      fill={fill || "currentColor"}
    />
    <path
      d="M27.492 19.6757L24.0916 24H29.5177L33.4244 19.6757H27.492Z"
      fill={fill || "currentColor"}
    />
  </svg>
);

export function CinematicLoader({
  onComplete,
  forceShow = false,
  className,
  ...props
}: CinematicLoaderProps) {
  const [isDismissed, setIsDismissed] = React.useState<boolean>(false);

  // References to animated DOM nodes
  const containerRef = React.useRef<HTMLDivElement>(null);
  const curtainPanelRef = React.useRef<HTMLDivElement>(null);
  const centerContentRef = React.useRef<HTMLDivElement>(null);
  const logoWrapperRef = React.useRef<HTMLDivElement>(null);
  const counterRef = React.useRef<HTMLSpanElement>(null);
  const hairlineRef = React.useRef<HTMLDivElement>(null);
  const statusRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const isForcedByUrl =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("intro");
    const shouldForce = forceShow || isForcedByUrl;
    const isMobileViewport =
      typeof window !== "undefined" && window.innerWidth < 768;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const isAlreadyLoaded =
      !shouldForce &&
      (Boolean(sessionStorage.getItem("gamezygo_loaded")) ||
        isMobileViewport ||
        prefersReducedMotion);

    if (isAlreadyLoaded) {
      setIsDismissed(true);
      onComplete?.();
      return;
    }

    // Lock page scrolling during opening sequence
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Create GSAP Context for clean React 19 StrictMode lifecycle management
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = originalOverflow;
          setIsDismissed(true);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("gamezygo_loaded", "true");
          }
          onComplete?.();
        },
      });

      // Initial positions & states
      gsap.set(containerRef.current, { visibility: "visible" });
      gsap.set(curtainPanelRef.current, { yPercent: 0 });
      gsap.set(logoWrapperRef.current, { opacity: 0, scale: 0.95 });
      gsap.set(centerContentRef.current, { opacity: 1, y: 0 });
      gsap.set(hairlineRef.current, { scaleX: 0 });

      // Counter state object for smooth interpolation
      const counterProgress = { value: 0 };

      // ========================================================
      // 0.0s – 0.6s : Logo Entry
      // ========================================================
      tl.to(
        logoWrapperRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        0.0
      );

      // ========================================================
      // 0.3s – 1.8s : Smooth Percentage Counter & Hairline Progress
      // ========================================================
      tl.to(
        counterProgress,
        {
          value: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            const current = Math.round(counterProgress.value);
            const formatted = current < 10 ? `0${current}%` : `${current}%`;
            if (counterRef.current) {
              counterRef.current.textContent = formatted;
            }

            // Update status text dynamically based on progress milestone
            if (statusRef.current) {
              if (current < 35) {
                statusRef.current.textContent = "INITIALIZING VAULT ENVIRONMENT";
              } else if (current < 75) {
                statusRef.current.textContent = "SYNCHRONIZING STEAM CLOUD";
              } else if (current < 100) {
                statusRef.current.textContent = "VERIFYING 2FA TOKENS";
              } else {
                statusRef.current.textContent = "VAULT READY — ACCESS GRANTED";
              }
            }
          },
        },
        0.3
      );

      tl.to(
        hairlineRef.current,
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
        },
        0.3
      );

      // ========================================================
      // 1.8s – 2.1s : Short Pause at 100% (200ms - 300ms)
      // ========================================================
      // Timeline naturally pauses here until the next action at 2.1s

      // ========================================================
      // 2.1s – 2.95s : Exit Animation (Dari Bawah ke Atas / Slide Up)
      // ========================================================
      // 1. Center Content floats up slightly and dissolves
      tl.to(
        centerContentRef.current,
        {
          opacity: 0,
          y: -40,
          duration: 0.4,
          ease: "power2.in",
        },
        2.1
      );

      // 2. Entire Curtain Panel sweeps up to reveal landing page from bottom to top
      tl.to(
        curtainPanelRef.current,
        {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
        },
        2.15
      );
    }, containerRef);

    return () => {
      document.body.style.overflow = originalOverflow;
      ctx.revert();
    };
  }, [forceShow, onComplete]);

  if (isDismissed) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Loading Gamezygo Storefront"
      className={cn(
        "fixed inset-0 z-9999 pointer-events-auto select-none overflow-hidden font-sans invisible",
        className
      )}
      {...props}
    >
      {/* SVG Definition Gradient for Emblem */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient
            id="cinematic-loader-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="50%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>
        </defs>
      </svg>

      {/* ========================================================
          FULL-SCREEN SEAMLESS CURTAIN PANEL (NO VERTICAL SEAM/LINE)
          Animates up from bottom to top: yPercent 0 -> -100
         ======================================================== */}
      <div
        ref={curtainPanelRef}
        className="absolute inset-0 w-full h-full bg-[#080C18] will-change-transform flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Subtle radial ambient atmosphere (full bleed, no seams) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] bg-radial from-rose-950/15 via-transparent to-transparent pointer-events-none" />

        {/* Center Glow Halo */}
        <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-rose-600/10 blur-[100px] pointer-events-none -translate-y-6" />

        {/* ========================================================
            CENTER FOREGROUND CONTENT (Logo, Percentage, Hairline)
           ======================================================== */}
        <div
          ref={centerContentRef}
          className="relative z-20 flex flex-col items-center justify-center pointer-events-none px-6 will-change-transform"
        >
          {/* Brand Logo & Tagline */}
          <div
            ref={logoWrapperRef}
            className="flex flex-col items-center gap-3.5 will-change-transform"
          >
            <GamezygoEmblem
              className="w-18 h-10 sm:w-22 sm:h-12 drop-shadow-[0_0_25px_rgba(225,29,72,0.45)]"
              fill="url(#cinematic-loader-gradient)"
            />
            <div className="flex flex-col items-center gap-1">
              <span className="text-body-sm sm:text-body-md font-extrabold tracking-[0.4em] text-gray-100 uppercase pl-1">
                GAMEZYGO
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
                ORIGINAL GAME VAULT & SHARING
              </span>
            </div>
          </div>

          {/* Large Counter Number Display */}
          <div className="mt-8 sm:mt-12 flex flex-col items-center">
            <div className="flex items-baseline font-mono tracking-tighter">
              <span
                ref={counterRef}
                className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tabular-nums drop-shadow-[0_0_35px_rgba(255,255,255,0.18)]"
              >
                00%
              </span>
            </div>

            {/* Minimalist Hairline Progress Indicator */}
            <div className="w-48 sm:w-72 h-0.5 bg-white/10 rounded-full mt-4 sm:mt-6 overflow-hidden relative">
              <div
                ref={hairlineRef}
                className="h-full bg-linear-to-r from-rose-500 via-rose-400 to-indigo-400 w-full origin-left scale-x-0 will-change-transform shadow-[0_0_8px_rgba(244,63,94,0.6)]"
              />
            </div>

            {/* Status Eyebrow with Pulse Dot */}
            <div className="mt-4 flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)] animate-pulse" />
              <span
                ref={statusRef}
                className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-gray-400 font-medium select-none"
              >
                INITIALIZING VAULT ENVIRONMENT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
