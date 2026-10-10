import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  ref?: React.Ref<HTMLButtonElement>;
}

export function AdminButton({
  children,
  variant = "dark",
  size = "md",
  className,
  ref,
  ...props
}: AdminButtonProps) {
  const variantStyles = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-600/30",
    secondary:
      "bg-[#222533] text-white hover:bg-[#292D3E] border border-deep-blue-700",
    dark:
      "bg-[#1E202B] text-gray-200 hover:text-white hover:bg-[#252837] border border-deep-blue-700",
    outline:
      "bg-transparent text-gray-300 hover:text-white border border-deep-blue-700 hover:bg-white/5",
    ghost:
      "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
  }[variant];

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-lg font-medium",
    md: "px-4 py-2 text-xs sm:text-sm rounded-lg font-medium",
    lg: "px-5 py-2.5 text-sm rounded-lg font-semibold",
  }[size];

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 cursor-pointer transition-all select-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none",
        sizeStyles,
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
