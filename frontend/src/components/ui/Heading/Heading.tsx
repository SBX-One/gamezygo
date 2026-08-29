import * as React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  emphasized?: boolean;
  gradient?: boolean;
  children: React.ReactNode;
}

export function Heading({
  level,
  emphasized = false,
  gradient = false,
  className,
  children,
  ...props
}: HeadingProps) {
  const Component = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const sizeClasses = {
    1: "text-h1",
    2: "text-h2",
    3: "text-h3",
    4: "text-h4",
    5: "text-h5",
    6: "text-h6",
  };

  return (
    <Component
      className={cn(
        sizeClasses[level],
        emphasized ? "font-bold" : "font-medium tracking-[-4%]",
        gradient && "text-gradient-heading",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
