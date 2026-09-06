import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type FieldSize = "sm" | "md" | "lg";

export type FieldState =
  | "default"
  | "unfilled"
  | "filled"
  | "hover"
  | "focus"
  | "pressed"
  | "disabled";

export const fieldVariants = cva(
  "group relative inline-flex w-full items-center justify-between transition-all hover:border-neutral-500 hover:bg-deep-blue-700 duration-150 select-none border border-deep-blue-700 shadow-sm bg-deep-blue-900 text-gray-50",
  {
    variants: {
      size: {
        sm: "min-h-10 rounded-lg px-3 py-1.5 gap-2.5 text-body-xs",
        md: "min-h-12 rounded-lg px-3.5 py-2.5 gap-3 text-body-sm",
        lg: "min-h-16 rounded-xl px-4 py-3 gap-3.5 text-body-md",
      },
      forceState: {
        default: "",
        unfilled: "",
        filled: "[&_input]:font-semibold [&_input]:text-gray-50",
        hover: "",
        focus: "ring-2 ring-white/20 border-neutral-500",
        pressed: "border-neutral-500 [&_.field-icon]:text-deep-blue-200",
        disabled: "!bg-gray-500 !bg-none !border-transparent opacity-50 cursor-not-allowed pointer-events-none",
      },
    },
    defaultVariants: {
      size: "lg",
      forceState: "default",
    },
  }
);

export interface FieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof fieldVariants> {
  /** Slot icon di sisi kiri input */
  leftIcon?: React.ReactNode;
  /** Slot icon di sisi kanan input */
  rightIcon?: React.ReactNode;
  /** Ukuran field (sm, md, lg) */
  size?: FieldSize;
  /** State override manual untuk keperluan preview matrix / testing */
  forceState?: FieldState;
  /** Container class overrides */
  containerClassName?: string;
  /** Ref untuk inner input element */
  inputRef?: React.Ref<HTMLInputElement>;
}

const iconSizeClasses: Record<FieldSize, string> = {
  sm: "[&>svg]:w-4 [&>svg]:h-4 shrink-0",
  md: "[&>svg]:w-4.5 [&>svg]:h-4.5 shrink-0",
  lg: "[&>svg]:w-5 [&>svg]:h-5 shrink-0",
};

export function Field({
  className,
  containerClassName,
  size = "lg",
  forceState = "default",
  leftIcon,
  rightIcon,
  disabled,
  placeholder = "Cari di toko",
  value,
  defaultValue,
  inputRef,
  ...props
}: FieldProps) {
  const currentSize: FieldSize = size || "lg";
  const isDisabled = disabled || forceState === "disabled";

  return (
    <div
      className={cn(
        fieldVariants({ size, forceState }),
        containerClassName,
        className
      )}
    >
      {/* 1. Left Icon Slot */}
      {leftIcon && (
        <span
          className={cn(
            "field-icon field-left-icon flex items-center justify-center text-deep-blue-100 transition-colors duration-150 group-hover:text-gray-50 group-focus-within:text-deep-blue-200 group-active:text-deep-blue-200 shrink-0",
            iconSizeClasses[currentSize]
          )}
        >
          {leftIcon}
        </span>
      )}

      {/* 2. Main Input Element */}
      <input
        ref={inputRef}
        disabled={isDisabled}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        className={cn(
          "w-full bg-transparent border-0 outline-none text-gray-50 text-body-lg placeholder:text-deep-blue-100/70  transition-colors focus:outline-none disabled:cursor-not-allowed",
          forceState === "filled" && " text-gray-50"
        )}
        {...props}
      />
 
      {/* 3. Right Icon Slot */}
      {rightIcon && (
        <span
          className={cn(
            "field-icon field-right-icon flex items-center justify-center text-deep-blue-100 transition-colors duration-150 group-hover:text-gray-50 group-focus-within:text-deep-blue-200 group-active:text-deep-blue-200 shrink-0",
            iconSizeClasses[currentSize]
          )}
        >
          {rightIcon}
        </span>
      )}
    </div>
  );
}
