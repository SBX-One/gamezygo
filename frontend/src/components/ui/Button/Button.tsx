import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "inactive"
  | "inactiveDashboard"
  | "active";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type ButtonState =
  | "default"
  | "hover"
  | "focus"
  | "pressed"
  | "disabled";

export const buttonVariants = cva(
  "inline-flex w-fit h-fit items-center justify-center gap-4  transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-offset-1 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:bg-gray-700 disabled:bg-none disabled:border-transparent",
  {
    variants: {
      variant: {
        primary:
          "bg-[image:var(--gradient-primary-default)] text-gray-50 hover:bg-[image:var(--gradient-primary-hover)] hover:[&_.button-main-text]:text-rose-200 active:bg-[image:var(--gradient-primary-pressed)] active:scale-98 focus-visible:ring-2 focus-visible:ring-gray-50 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
        secondary:
          "bg-[image:var(--gradient-surface-secondary-default)] text-gray-50 hover:[&_.button-main-text]:text-deep-blue-400 active:[&_.button-main-text]:text-deep-blue-400 hover:[&_.button-left-icon]:text-deep-blue-100 hover:[&_.button-right-icon]:text-deep-blue-100 active:[&_.button-left-icon]:text-deep-blue-100 active:[&_.button-right-icon]:text-deep-blue-100   hover:bg-[image:var(--gradient-surface-secondary-hover)]  active:bg-[image:var(--gradient-surface-secondary-pressed)] active:scale-98 focus-visible:ring-2 focus-visible:ring-gray-50 disabled:opacity-50 disabled:pointer-events-none",
        outline:
          "border-gradient-outline text-gray-50 hover:[&_.button-main-text]:text-deep-blue-400 active:[&_.button-main-text]:text-deep-blue-400 hover:[&_.button-left-icon]:text-deep-blue-100 hover:[&_.button-right-icon]:text-deep-blue-100 active:[&_.button-left-icon]:text-deep-blue-100 active:[&_.button-right-icon]:text-deep-blue-100  active:scale-98 focus-visible:ring-2 focus-visible:ring-gray-50 disabled:opacity-50 disabled:pointer-events-none",
        ghost:
          "bg-transparent text-gray-50 !rounded-none hover:[&_.button-main-text]:text-deep-blue-400 active:[&_.button-main-text]:text-deep-blue-400 hover:[&_.button-left-icon]:text-deep-blue-100 hover:[&_.button-right-icon]:text-deep-blue-100 active:[&_.button-left-icon]:text-deep-blue-100 active:[&_.button-right-icon]:text-deep-blue-100  active:scale-98 focus-visible:ring-2 focus-visible:ring-gray-50 disabled:opacity-50 disabled:pointer-events-none",
        inactive:
          "border-gradient-inactive text-gray-50 hover:[&_.button-left-icon]:text-deep-blue-100 hover:[&_.button-right-icon]:text-deep-blue-100 active:[&_.button-left-icon]:text-deep-blue-100 active:[&_.button-right-icon]:text-deep-blue-100  active:scale-98 focus-visible:ring-2 focus-visible:ring-gray-50 disabled:opacity-50 disabled:pointer-events-none",
        inactiveDashboard:
          "bg-transparent text-gray-50   hover:[&_.button-left-icon]:text-deep-blue-100 hover:[&_.button-right-icon]:text-deep-blue-100 active:[&_.button-left-icon]:text-deep-blue-100 active:[&_.button-right-icon]:text-deep-blue-100  active:scale-98 focus-visible:ring-2 focus-visible:ring-gray-50 disabled:opacity-50 disabled:pointer-events-none",
        active:
          "bg-[image:var(--gradient-surface-secondary-default)]  text-gray-50 hover:[&_.button-main-text]:text-deep-blue-400 active:[&_.button-main-text]:text-deep-blue-400 hover:[&_.button-left-icon]:text-deep-blue-100 hover:[&_.button-right-icon]:text-deep-blue-100 active:[&_.button-left-icon]:text-deep-blue-100 active:[&_.button-right-icon]:text-deep-blue-100 border-[#2F2F37]  hover:bg-[image:var(--gradient-surface-secondary-hover)] hover:border-neutral-500 active:bg-[image:var(--gradient-surface-secondary-pressed)] active:scale-98 focus-visible:ring-2 focus-visible:ring-gray-50 disabled:opacity-50 disabled:pointer-events-none",
      },
      size: {
        xs: "text-label-xs rounded-lg gap-4 p-1",
        sm: "text-label-sm rounded-lg gap-4 px-3.75 py-2.5",
        md: "text-label-md rounded-lg gap-4 p-4.5 ",
        lg: "text-label-lg rounded-lg gap-4 p-6",
      },
      forceState: {
        default: "",
        hover: "brightness-110 ",
        focus: "ring-2 ring-white/50 ring-offset-1 ring-offset-black",
        pressed: "scale-98 brightness-90",
        disabled: "!bg-gray-700 !bg-none !border-transparent pointer-events-none cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      forceState: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Slot Label/Badge/Auxiliary text di sisi paling kiri (misal: 'Promo End in 05:35') */
  leftLabel?: React.ReactNode;
  /** Slot Icon di sebelah kiri main text */
  leftIcon?: React.ReactNode;
  /** Slot Icon di sebelah kanan main text */
  rightIcon?: React.ReactNode;
  /** Slot Label/Badge/Auxiliary text di sisi paling kanan (misal: 'Promo End in 05:35') */
  rightLabel?: React.ReactNode;
  /** State override manual untuk keperluan Storybook, UI preview matrix, atau unit testing */
  forceState?: ButtonState;
  /** Menentukan tombol mengambil 100% lebar container */
  fullWidth?: boolean;
  /** Status loading */
  isLoading?: boolean;
  /** React 19 native ref */
  ref?: React.Ref<HTMLButtonElement>;
}

const labelSizeClasses: Record<ButtonSize, string> = {
  xs: "text-label-xs text-gray-400 leading-[120%]",
  sm: "text-label-xs text-gray-400 leading-[120%] ",
  md: "text-label-sm text-gray-400 leading-[120%]",
  lg: "text-label-sm text-gray-400 leading-[120%]",
};

const iconSizeClasses: Record<ButtonSize, string> = {
  xs: "[&>svg]:w-3.5 [&>svg]:h-3.5 shrink-0",
  sm: "[&>svg]:w-4 [&>svg]:h-4 shrink-0",
  md: "[&>svg]:w-4.5 [&>svg]:h-4.5 shrink-0",
  lg: "[&>svg]:w-5 [&>svg]:h-5 shrink-0",
};

const buttonTextSizeClasses: Record<ButtonSize, string> = {
  xs: "text-label-xs font-medium",
  sm: "text-label-sm font-medium",
  md: "text-label-md font-semibold",
  lg: "text-label-lg font-semibold",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  forceState = "default",
  fullWidth = false,
  isLoading = false,
  disabled,
  leftLabel,
  leftIcon,
  rightIcon,
  rightLabel,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  const currentSize: ButtonSize = size || "md";
  const isDisabled =
    disabled || isLoading || forceState === "disabled";

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={cn(
        buttonVariants({ variant, size, forceState }),
        fullWidth && "w-full ",
        className
      )}
      {...props}
    >
      {/* 1. Left Label / Auxiliary Slot */}
      {leftLabel && (
        <span
          className={cn(
            "button-left-label shrink-0 select-none",
            labelSizeClasses[currentSize]
          )}
        >
          {leftLabel}
        </span>
      )}

      {/* 2. Left Icon Slot */}
      {leftIcon && (
        <span
          className={cn(
            "button-left-icon flex items-center justify-center text-gray-50 shrink-0 ",
            iconSizeClasses[currentSize]
          )}
        >
          {leftIcon}
        </span>
      )}

      {/* 3. Main Text / Children Slot */}
      {children && (
        <span
          className={cn(
            "button-main-text text-gray-50 inline-flex items-center gap-4",
            buttonTextSizeClasses[currentSize]
          )}
        >
          {children}
        </span>
      )}

      {/* 4. Right Icon Slot */}
      {rightIcon && (
        <span
          className={cn(
            "button-right-icon flex items-center justify-center text-gray-50 shrink-0",
            iconSizeClasses[currentSize]
          )}
        >
          {rightIcon}
        </span>
      )}

      {/* 5. Right Label / Auxiliary Slot */}
      {rightLabel && (
        <span
          className={cn(
            "button-right-label shrink-0 select-none",
            labelSizeClasses[currentSize]
          )}
        >
          {rightLabel}
        </span>
      )}
    </button>
  );
}
