import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminFaqHeaderProps {
  title?: string;
  lastEdit?: string;
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
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

export function AdminFaqHeader({
  title = "Frequently Asked Questions",
  lastEdit = "Last edit 7 days ago",
  categories,
  activeCategory,
  onSelectCategory,
  className,
}: AdminFaqHeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("w-full flex flex-col gap-5 select-none font-sans", className)}>
      {/* Top Header Row: Left Title/Subtitle & Right Category Button (Figma: Type Outline, Size sm) */}
      <div className="flex items-center justify-between gap-4 flex-wrap w-full">
        {/* Left: Frequently Asked Questions & Last Edit */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
            {title}
          </h2>
          {lastEdit && (
            <p className="text-label-xs text-gray-400 mt-1 font-normal">
              {lastEdit}
            </p>
          )}
        </div>

        {/* Right: Category Dropdown (Figma: Outline sm, 140 Hug x 40 min) */}
        <div ref={dropdownRef} className="relative">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsOpen((prev) => !prev)}
            rightIcon={
              <ChevronDownIcon
                className={cn(
                  "w-4 h-4 text-gray-300 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            }
            className="min-w-[140px] min-h-[40px] h-10 px-4 justify-between"
          >
            <span>{activeCategory}</span>
          </Button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 top-12 z-50 w-44 rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
              {categories.map((cat) => {
                const isSelected = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-label-xs font-medium transition-colors cursor-pointer",
                      isSelected
                        ? "bg-deep-blue-800 text-white font-semibold"
                        : "text-gray-300 hover:bg-deep-blue-800/60 hover:text-white"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Divider Line matching Image 4 */}
      <div className="w-full h-px bg-deep-blue-700/60" />
    </div>
  );
}
