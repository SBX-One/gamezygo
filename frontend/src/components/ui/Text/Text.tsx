import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  size?: "xl" | "lg" | "md" | "sm" | "xs";
  emphasized?: boolean;
  as?: "p" | "span" | "div";
  children: React.ReactNode;
}

export function Text({
  size = "md",
  emphasized = false,
  as: Component = "p",
  className,
  children,
  ...props
}: TextProps) {
  const sizeClasses = {
    xl: "text-body-xl",
    lg: "text-body-lg",
    md: "text-body-md",
    sm: "text-body-sm",
    xs: "text-body-xs",
  };

  return (
    <Component
      className={cn(
        sizeClasses[size],
        emphasized ? "font-semibold" : "font-normal",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
