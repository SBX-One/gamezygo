import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminDropdownOption {
  label: string;
  value: string;
}

export interface AdminDropdownProps {
  options: AdminDropdownOption[];
  selectedValue?: string;
  onSelect?: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  placeholder?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export function AdminDropdown({
  options,
  selectedValue,
  onSelect,
  className,
  buttonClassName,
  menuClassName,
  placeholder,
  ref,
}: AdminDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    options[0]?.value || "today"
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const currentSelected =
    selectedValue !== undefined ? selectedValue : uncontrolledValue;
  const activeOption = options.find((opt) => opt.value === currentSelected);
  const displayLabel =
    activeOption?.label || placeholder || options[0]?.label || "Pilih";

  return (
    <div
      ref={ref || containerRef}
      className={cn(
        "relative inline-block text-left",
        isOpen ? "z-50" : "z-10",
        className
      )}
    >
      {/* 1. Trigger Button: Figma Image 2 (Button, State: Default, Type: Outline, Size: sm, 112 Fill x 40 min) */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(
          "w-28 min-w-28 h-10 justify-between px-3 text-white text-sm font-medium border-gradient-outline rounded-lg",
          buttonClassName
        )}
        rightIcon={
          <ChevronDownIcon
            className={cn(
              "w-4 h-4 text-white transition-transform duration-200 shrink-0",
              isOpen && "rotate-180"
            )}
          />
        }
      >
        <span className="truncate">{displayLabel}</span>
      </Button>

      {/* 2. Dropdown Menu Popup: Figma Image 3 (W: 150, H: 199, Gap: 12, Padding: [8, 13], Corner: 8, Fill: Surface, Stroke: 1px) */}
      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 mt-1.5 w-37.5 rounded-lg bg-deep-blue-900 border border-deep-blue-700 px-2 py-3.25 shadow-2xl shadow-black/90 z-50 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-100",
            menuClassName
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === currentSelected;

            {/* Active Item: Figma Image 5 (Button, State: Default, Type: Active, Size: xs, 132 Fill x 25) */}
            if (isSelected) {
              return (
                <Button
                  key={option.value}
                  variant="active"
                  size="xs"
                  fullWidth
                  onClick={() => {
                    setUncontrolledValue(option.value);
                    onSelect?.(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full h-6.25 justify-start px-2 text-xs font-semibold text-white [&_.button-main-text]:text-white! hover:[&_.button-main-text]:text-white! active:[&_.button-main-text]:text-white! rounded-lg border border-deep-blue-700 bg-(image:--gradient-surface-secondary-default)"
                >
                  <span className="text-white! font-semibold">{option.label}</span>
                </Button>
              );
            }

            {/* Inactive Item: Figma Image 4 (Typography: Label/xs/Emphasized 12/120, W: 132 Fill, H: 25) */}
            return (
              <button
                key={option.value}
                type="button"
                role="menuitem"
                onClick={() => {
                  setUncontrolledValue(option.value);
                  onSelect?.(option.value);
                  setIsOpen(false);
                }}
                className="w-full h-6.25 px-2 text-left text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center transition-colors cursor-pointer select-none"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
