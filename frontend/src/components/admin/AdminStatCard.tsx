import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminCard } from "./AdminCard";

export interface AdminStatCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  headerRight?: React.ReactNode;
  valueClassName?: string;
  subtitleClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export function AdminStatCard({
  title,
  value,
  subtitle,
  headerRight,
  valueClassName,
  subtitleClassName,
  className,
  ref,
  ...props
}: AdminStatCardProps) {
  return (
    <AdminCard
      ref={ref}
      title={title}
      headerRight={headerRight}
      className={cn("flex flex-col justify-between", className)}
      bodyClassName="flex flex-col justify-center gap-4 py-5"
      {...props}
    >
      <div
        className={cn(
          "text-2xl sm:text-3xl font-bold text-white tracking-tight",
          valueClassName
        )}
      >
        {value}
      </div>

      {subtitle && (
        <div
          className={cn(
            "text-xs font-semibold tracking-wider text-gray-400 uppercase",
            subtitleClassName
          )}
        >
          {subtitle}
        </div>
      )}
    </AdminCard>
  );
}
