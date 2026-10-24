import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  id?: string;
  ariaLabel?: string;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="2.5 6 5 8.5 9.5 3.5" />
  </svg>
);

export function AdminCheckbox({
  checked = false,
  onChange,
  disabled = false,
  label,
  id,
  ariaLabel,
  className,
  ref,
}: AdminCheckboxProps) {
  const autoId = React.useId();
  const inputId = id || autoId;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "inline-flex items-center gap-2 cursor-pointer select-none text-label-xs text-gray-300 hover:text-white transition-colors",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      <div className="relative flex gap-2.5 items-center justify-center">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-label={ariaLabel || (typeof label === "string" ? label : undefined)}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={cn(
            "w-4.5 h-4.5 rounded border flex items-center justify-center transition-all duration-150",
            checked
              ? " border-gray-400 text-white"
              : "bg-gray-950 border-[#374151] text-transparent hover:border-gray-400"
          )}
        >
          {checked && <CheckIcon className="w-4 h-4 text-white" />}
        </div>
      </div>
      {label && <span className="text-label-sm font-semibold text-gray-400">{label}</span>}
    </label>
  );
}
