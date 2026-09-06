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
}

export function Tabs({
  items,
  activeId,
  defaultActiveId,
  onChange,
  fullWidth = false,
  className,
  ...props
}: TabsProps) {
  const [internalActiveId, setInternalActiveId] = React.useState<string>(
    defaultActiveId || items[0]?.id || ""
  );

  const currentActiveId = activeId !== undefined ? activeId : internalActiveId;

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
        "relative flex items-center border-b border-gray-700 w-full select-none",
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
              "relative pb-3 text-label-sm px-6 text-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50",
              fullWidth ? "flex-1" : "shrink-0",
              isActive
                ? "text-gray-50"
                : "text-deep-blue-100 hover:text-gray-50 font-normal",
              item.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
            )}
          >
            <span className="whitespace-nowrap">{item.label}</span>

            {/* Active Bottom Red Indicator Bar */}
            {isActive && (
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
