import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  size?: "xl" | "lg" | "md" | "sm" | "xs";
  emphasized?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

export function Label({
  size = "md",
  emphasized = false,
  htmlFor,
  className,
  children,
  ...props
}: LabelProps) {
  const sizeClasses = {
    xl: "text-label-xl",
    lg: "text-label-lg",
    md: "text-label-md",
    sm: "text-label-sm",
    xs: "text-label-xs",
  };

  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        sizeClasses[size],
        emphasized ? "font-bold" : "font-medium",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
