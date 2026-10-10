import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

export function AdminSwitch({
  checked = false,
  onChange,
  disabled = false,
  ariaLabel = "Toggle switch",
  className,
  ref,
}: AdminSwitchProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange?.(!checked);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 select-none",
        checked
          ? "bg-[#1E202B] border-deep-blue-700"
          : "bg-[#13141B] border-deep-blue-700/80",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full shadow-md transition duration-200 ease-in-out",
          checked
            ? "translate-x-4.5 bg-[#FF5364]"
            : "translate-x-0.5 bg-gray-500"
        )}
      />
    </button>
  );
}
