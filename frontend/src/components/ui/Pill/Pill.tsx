import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type PillVariant =
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "success";

export type PillSize = "xs" | "sm" | "md";

export const pillVariants = cva(
  "inline-flex w-fit items-center justify-center font-medium transition-all duration-150 select-none rounded-full",
  {
    variants: {
      variant: {
        primary:
          "bg-[image:var(--gradient-primary-default)] text-gray-50",
        secondary:
          "bg-deep-blue-900 text-gray-400 border border-deep-blue-700  [&_.pill-icon]:text-deep-blue-100",
        error:
          "bg-red-900 text-rose-600",
        warning:
          "bg-yellow-900 text-yellow-600",
        success:
          "bg-green-900 text-green-600",
      },
      size: {
        xs: "h-fit w-fit  px-1.5 py-1.5 gap-2 text-label-xs",
        sm: "h-fit w-fit  py-2 px-3 gap-3 text-label-sm",
        md: "h-fit w-fit p-3.5 gap-3 text-label-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface PillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillVariants> {
  /** Slot Icon di sebelah kiri teks */
  leftIcon?: React.ReactNode;
  /** Slot Icon di sebelah kanan teks (misal: tombol close/remove) */
  rightIcon?: React.ReactNode;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}

const iconSizeClasses: Record<PillSize, string> = {
  xs: "[&>svg]:w-3 [&>svg]:h-3 shrink-0",
  sm: "[&>svg]:w-3.5 [&>svg]:h-3.5 shrink-0",
  md: "[&>svg]:w-4 [&>svg]:h-4 shrink-0",
};

export function Pill({
  className,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  children,
  ref,
  ...props
}: PillProps) {
  const currentSize: PillSize = size || "md";

  return (
    <div
      ref={ref}
      className={cn(pillVariants({ variant, size }), className)}
      {...props}
    >
      {/* 1. Left Icon Slot */}
      {leftIcon && (
        <span
          className={cn(
            "pill-icon flex items-center justify-center shrink-0",
            iconSizeClasses[currentSize]
          )}
        >
          {leftIcon}
        </span>
      )}

      {/* 2. Main Content Slot */}
      {children && (
        <span className="pill-text tracking-wide whitespace-nowrap">
          {children}
        </span>
      )}

      {/* 3. Right Icon Slot */}
      {rightIcon && (
        <span
          className={cn(
            "pill-icon flex items-center justify-center shrink-0",
            iconSizeClasses[currentSize]
          )}
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
}
