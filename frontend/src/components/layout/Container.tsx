import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

export function Container({ className, ref, ...props }: ContainerProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    />
  );
}
