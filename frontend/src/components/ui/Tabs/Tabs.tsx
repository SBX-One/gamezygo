import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  /** Identifier unik untuk tab */
  id: string;
  /** Label teks untuk tab */
  label: React.ReactNode;
  /** Apakah tab dinonaktifkan */
  disabled?: boolean;
}

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Daftar item tab */
  items: TabItem[];
  /** ID tab yang sedang aktif (Controlled) */
  activeId?: string;
  /** ID tab aktif default (Uncontrolled) */
  defaultActiveId?: string;
  /** Callback saat tab berganti */
  onChange?: (id: string) => void;
  /** Menentukan tab mengambil lebar penuh atau fit content */
  fullWidth?: boolean;
  /** Orientasi tab: horizontal, vertical, atau responsive (flex-col di mobile, sm:flex-row di desktop) */
  orientation?: "horizontal" | "vertical" | "responsive";
}

export function Tabs({
  items,
  activeId,
  defaultActiveId,
  onChange,
  fullWidth = false,
  orientation = "horizontal",
  className,
  ...props
}: TabsProps) {
  const [internalActiveId, setInternalActiveId] = React.useState<string>(
    defaultActiveId || items[0]?.id || ""
  );

  const currentActiveId = activeId !== undefined ? activeId : internalActiveId;
  const isResponsive = orientation === "responsive";
  const isVertical = orientation === "vertical";

  const handleTabClick = (id: string, disabled?: boolean) => {
    if (disabled) return;
    if (activeId === undefined) {
      setInternalActiveId(id);
    }
    onChange?.(id);
  };

  return (
    <div
      role="tablist"
      className={cn(
        "relative w-full select-none",
        isResponsive
          ? "flex flex-col sm:flex-row sm:items-center border-b border-gray-700"
          : isVertical
          ? "flex flex-col border-l border-gray-700"
          : "flex items-center border-b border-gray-700",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = item.id === currentActiveId;

        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            disabled={item.disabled}
            onClick={() => handleTabClick(item.id, item.disabled)}
            className={cn(
              "relative text-label-sm transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50",
              isResponsive
                ? "w-full sm:w-auto text-left sm:text-center px-4 sm:px-6 py-2.5 sm:py-0 sm:pb-3 border-b sm:border-b-0 border-deep-blue-700/40"
                : isVertical
                ? "w-full text-left px-4 py-2.5"
                : "pb-3 px-6 text-center",
              fullWidth ? "flex-1" : "shrink-0",
              isActive
                ? "text-gray-50 font-semibold"
                : "text-deep-blue-100 hover:text-gray-50 font-normal",
              item.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
            )}
          >
            <span className="whitespace-nowrap">{item.label}</span>

            {/* Active Indicator Bar */}
            {isActive && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute bg-rose-500 rounded-full",
                  isResponsive
                    ? "left-0 top-1 bottom-1 w-1 sm:top-auto sm:bottom-0 sm:left-0 sm:right-0 sm:w-auto sm:h-0.5"
                    : isVertical
                    ? "left-0 top-0 bottom-0 w-1"
                    : "bottom-0 left-0 right-0 h-0.5"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
