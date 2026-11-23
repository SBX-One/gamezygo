import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "pending" | "success" | "danger" | "count" | "neutral";
  size?: "sm" | "md";
}

export function AdminBadge({
  children,
  variant = "neutral",
  size = "sm",
  className,
  ...props
}: AdminBadgeProps) {
  const variantStyles = {
    pending:
      "bg-[#3d2614] text-[#F59E0B] border border-[#78350F]/50 shadow-sm shadow-amber-950/20",
    success:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
    danger:
      "bg-rose-500/10 text-rose-400 border border-rose-500/25",
    count:
      "bg-[#151a28] text-gray-300 border border-white/10 font-normal",
    neutral:
      "bg-white/5 text-gray-300 border border-white/10",
  }[variant];

  const sizeStyles = {
    sm: "text-label-xs px-2.5 py-0.5 rounded-full font-medium",
    md: "text-sm px-3 py-1 rounded-full font-medium",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 leading-normal select-none transition-colors",
        sizeStyles,
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
