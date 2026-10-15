import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminInstructionEditorTopBarProps {
  title: string;
  onTitleChange: (title: string) => void;
  onClear: () => void;
  onDelete: () => void;
  className?: string;
}

/**
 * Dismiss / Clear Icon matching public/assets/svg/fluent_dismiss-24-regular.svg
 */
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.39716 4.55394L4.47016 4.46994C4.59715 4.34292 4.7655 4.2657 4.94461 4.2523C5.12372 4.2389 5.30169 4.29023 5.44616 4.39694L5.53016 4.46994L12.0002 10.9389L18.4702 4.46894C18.5394 4.39734 18.6222 4.34025 18.7137 4.30098C18.8052 4.26172 18.9036 4.24108 19.0032 4.24026C19.1028 4.23944 19.2015 4.25846 19.2937 4.29622C19.3859 4.33397 19.4696 4.3897 19.54 4.46015C19.6103 4.53061 19.666 4.61437 19.7037 4.70656C19.7413 4.79875 19.7603 4.89752 19.7593 4.9971C19.7584 5.09669 19.7377 5.19509 19.6983 5.28658C19.659 5.37806 19.6018 5.46079 19.5302 5.52994L13.0612 11.9999L19.5312 18.4699C19.658 18.5971 19.7351 18.7655 19.7483 18.9446C19.7615 19.1237 19.71 19.3016 19.6032 19.4459L19.5302 19.5299C19.4032 19.657 19.2348 19.7342 19.0557 19.7476C18.8766 19.761 18.6986 19.7097 18.5542 19.6029L18.4702 19.5299L12.0002 13.0609L5.53016 19.5309C5.38864 19.6675 5.19915 19.743 5.00251 19.7412C4.80586 19.7394 4.61779 19.6604 4.47879 19.5213C4.3398 19.3822 4.26102 19.194 4.2594 18.9974C4.25778 18.8007 4.33347 18.6113 4.47016 18.4699L10.9392 11.9999L4.46916 5.52994C4.34229 5.40283 4.26525 5.23441 4.25203 5.0553C4.23882 4.8762 4.29032 4.6983 4.39716 4.55394Z"
      fill="currentColor"
    />
  </svg>
);

export function AdminInstructionEditorTopBar({
  title,
  onTitleChange,
  onClear,
  onDelete,
  className,
}: AdminInstructionEditorTopBarProps) {
  return (
    <div className={cn("w-full flex flex-col gap-4 select-none font-sans", className)}>
      {/* Top Action Row: Title Input (Left) & Outline Buttons (Right) - Matching Gambar 2 */}
      <div className="flex items-center justify-between gap-4 flex-wrap w-full">
        {/* Left: Intruction Title input with clear X button */}
        <div className="relative w-72 sm:w-80 flex items-center">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Intruction Title"
            className="w-full h-10 pl-3.5 pr-9 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-deep-blue-500 transition-colors shadow-xs"
          />
          {title ? (
            <button
              type="button"
              onClick={() => onTitleChange("")}
              className="absolute right-3 p-0.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Hapus judul"
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="absolute right-3 p-0.5 text-gray-500 pointer-events-none">
              <CloseIcon className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Right: Clear Instruction & Delete Instruction buttons (Figma: Type Outline, Size xs) */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onClear}
            className="px-3 min-h-6.5 h-6.5 text-xs"
          >
            Clear Instruction
          </Button>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onDelete}
            className="px-3 min-h-6.5 h-6.5 text-xs"
          >
            Delete Instruction
          </Button>
        </div>
      </div>

      {/* Horizontal Divider Line across full width - Matching Gambar 2 */}
      <div className="w-full h-px bg-deep-blue-700/60" />
    </div>
  );
}
