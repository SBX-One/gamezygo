import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { AdminUserItem } from "../../types/admin-user.types";

export interface AdminUserEditDrawerProps {
  isOpen: boolean;
  user: AdminUserItem;
  onClose: () => void;
  onSave: (updatedData: { points: number; subsDuration: string }) => void;
  className?: string;
}

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function AdminUserEditDrawer({
  isOpen,
  user,
  onClose,
  onSave,
  className,
}: AdminUserEditDrawerProps) {
  const [points, setPoints] = React.useState<number>(user.points ?? 128);
  const [subsDuration, setSubsDuration] = React.useState<string>(
    user.subsDuration || "2 months"
  );

  // Sync state with incoming user
  React.useEffect(() => {
    if (user && isOpen) {
      setPoints(user.points ?? 128);
      setSubsDuration(user.subsDuration || "2 months");
    }
  }, [user, isOpen]);

  // Handle ESC key to close
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Stepper helper for subs duration
  const DURATION_PRESETS = [
    "1 month",
    "2 months",
    "3 months",
    "4 months",
    "5 months",
    "6 months",
    "12 months",
  ];

  const handleDecreaseDuration = () => {
    const idx = DURATION_PRESETS.indexOf(subsDuration);
    if (idx > 0) {
      setSubsDuration(DURATION_PRESETS[idx - 1]);
    } else if (idx === -1) {
      // Parse numeric month
      const match = subsDuration.match(/(\d+)/);
      if (match) {
        const num = Math.max(1, parseInt(match[1], 10) - 1);
        setSubsDuration(`${num} ${num === 1 ? "month" : "months"}`);
      } else {
        setSubsDuration("1 month");
      }
    }
  };

  const handleIncreaseDuration = () => {
    const idx = DURATION_PRESETS.indexOf(subsDuration);
    if (idx !== -1 && idx < DURATION_PRESETS.length - 1) {
      setSubsDuration(DURATION_PRESETS[idx + 1]);
    } else if (idx === -1) {
      const match = subsDuration.match(/(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10) + 1;
        setSubsDuration(`${num} months`);
      } else {
        setSubsDuration("3 months");
      }
    } else {
      // Already at 12 months, increment by 6
      setSubsDuration("24 months");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      points,
      subsDuration,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden select-none font-sans"
    >
      {/* Dimmed backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Right Slide-over Sidebar Panel (Matching user screenshot) */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-10 w-[380px] max-w-[90vw] h-full bg-deep-blue-950 border-l border-deep-blue-700 flex flex-col justify-start animate-in slide-in-from-right duration-200 overflow-y-auto",
          className
        )}
      >
        {/* Header: Edit User + Close Icon (Matching Screenshot) */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-deep-blue-700/80">
          <h3
            id="edit-user-drawer-title"
            className="text-base font-semibold text-white tracking-normal"
          >
            Edit User
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer rounded"
            aria-label="Tutup"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Field 1: POINTS */}
          <div className="space-y-2">
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
              POINTS
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="0"
                max="99999"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-deep-blue-900/60 border border-deep-blue-700 rounded-lg px-4 py-2.5 text-sm font-semibold text-white pr-12 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <span className="absolute right-4 text-label-xs font-semibold text-gray-400 pointer-events-none">
                pts
              </span>
            </div>
          </div>

          {/* Field 2: SUBS DURATION */}
          <div className="space-y-2">
            <label className="block text-label-xs font-semibold text-gray-400 uppercase tracking-wider">
              SUBS DURATION
            </label>
            <div className="w-full flex items-center justify-between border border-deep-blue-700 bg-deep-blue-900/40 rounded-lg px-4 py-2.5">
              {/* Minus / Decrement Button */}
              <button
                type="button"
                onClick={handleDecreaseDuration}
                aria-label="Kurangi durasi"
                className="text-gray-400 hover:text-white transition-colors cursor-pointer px-1 py-0.5 text-base font-semibold leading-none select-none"
              >
                —
              </button>

              {/* Value Text */}
              <span className="text-sm font-semibold text-white select-none">
                {subsDuration}
              </span>

              {/* Plus / Increment Button */}
              <button
                type="button"
                onClick={handleIncreaseDuration}
                aria-label="Tambah durasi"
                className="text-gray-400 hover:text-white transition-colors cursor-pointer px-1 py-0.5 text-base font-semibold leading-none select-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons: Batalkan & Simpan (Matching Screenshot Colors & Alignment) */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="inactive"
              size="sm"
              onClick={onClose}
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
