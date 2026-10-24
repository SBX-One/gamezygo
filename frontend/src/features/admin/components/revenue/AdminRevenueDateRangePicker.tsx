import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminRevenueDateRangePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onChangeRange?: (start: Date | null, end: Date | null, label: string) => void;
  onOpenChange?: (isOpen: boolean) => void;
  className?: string;
}

export const FluentCalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <rect x="3" y="4" width="18" height="17" rx="3" />
    <line x1="3" y1="9.5" x2="21" y2="9.5" />
    <circle cx="7.5" cy="13.5" r="0.75" fill="currentColor" />
    <circle cx="12" cy="13.5" r="0.75" fill="currentColor" />
    <circle cx="16.5" cy="13.5" r="0.75" fill="currentColor" />
    <circle cx="7.5" cy="17" r="0.75" fill="currentColor" />
    <circle cx="12" cy="17" r="0.75" fill="currentColor" />
    <circle cx="16.5" cy="17" r="0.75" fill="currentColor" />
  </svg>
);

const DismissIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const PRESET_OPTIONS = [
  { id: "hari_ini", label: "Hari Ini" },
  { id: "kemarin", label: "Kemarin" },
  { id: "minggu_ini", label: "Minggu ini" },
  { id: "bulan_ini", label: "Bulan ini" },
  { id: "tahun_ini", label: "Tahun ini" },
];

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sept",
  "Okt",
  "Nov",
  "Des",
];

interface CalendarCell {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

function formatDateShort(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = String(date.getFullYear()).slice(-2);
  return `${d}/${m}/${y}`;
}

export function AdminRevenueDateRangePicker({
  startDate: propStartDate,
  endDate: propEndDate,
  onChangeRange,
  onOpenChange,
  className,
}: AdminRevenueDateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    onOpenChange?.(next);
  };

  const closeOpen = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  // Default initial range: 08/09/26 - 15/09/26 (Minggu ini) matching Gambar 1
  const [activePreset, setActivePreset] = React.useState<string>("minggu_ini");
  const [startDate, setStartDate] = React.useState<Date | null>(() =>
    propStartDate !== undefined ? propStartDate : new Date(2026, 8, 8)
  );
  const [endDate, setEndDate] = React.useState<Date | null>(() =>
    propEndDate !== undefined ? propEndDate : new Date(2026, 8, 15)
  );

  // Calendar active view month/year (defaults to Sept 2026)
  const [viewDate, setViewDate] = React.useState<Date>(() => new Date(2026, 8, 1));
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Close when clicking outside or pressing Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeOpen();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeOpen();
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

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectPreset = (presetId: string) => {
    setActivePreset(presetId);
    let start: Date;
    let end: Date;

    if (presetId === "hari_ini") {
      start = new Date(2026, 8, 15);
      end = new Date(2026, 8, 15);
    } else if (presetId === "kemarin") {
      start = new Date(2026, 8, 14);
      end = new Date(2026, 8, 14);
    } else if (presetId === "minggu_ini") {
      start = new Date(2026, 8, 8);
      end = new Date(2026, 8, 15);
    } else if (presetId === "bulan_ini") {
      start = new Date(2026, 8, 1);
      end = new Date(2026, 8, 30);
    } else {
      // Tahun ini
      start = new Date(2026, 0, 1);
      end = new Date(2026, 11, 31);
    }

    setStartDate(start);
    setEndDate(end);
    setViewDate(new Date(start.getFullYear(), start.getMonth(), 1));

    const label =
      start.getTime() === end.getTime()
        ? formatDateShort(start)
        : `${formatDateShort(start)} - ${formatDateShort(end)}`;
    onChangeRange?.(start, end, label);
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActivePreset("");
    setStartDate(null);
    setEndDate(null);
    onChangeRange?.(null, null, "Tanggal");
  };

  const handleDayClick = (cellDate: Date) => {
    setActivePreset("");
    if (!startDate || (startDate && endDate)) {
      setStartDate(cellDate);
      setEndDate(null);
    } else {
      let finalStart = startDate;
      let finalEnd = cellDate;
      if (cellDate.getTime() < startDate.getTime()) {
        finalStart = cellDate;
        finalEnd = startDate;
      }
      setStartDate(finalStart);
      setEndDate(finalEnd);
      const label = `${formatDateShort(finalStart)} - ${formatDateShort(finalEnd)}`;
      onChangeRange?.(finalStart, finalEnd, label);
    }
  };

  // Generate dynamic 35 or 42 grid cells for active month
  const calendarCells = React.useMemo(() => {
    const cells: CalendarCell[] = [];
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    // 1. Previous month trailing days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
      cells.push({
        day: d,
        month: prevM,
        year: prevY,
        isCurrentMonth: false,
      });
    }

    // 2. Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      cells.push({
        day: d,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
      });
    }

    // 3. Next month leading days (fill to 35 or 42)
    const totalGridSize = cells.length <= 35 ? 35 : 42;
    const remaining = totalGridSize - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
      cells.push({
        day: d,
        month: nextM,
        year: nextY,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [viewYear, viewMonth]);

  const startTime = startDate
    ? new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      ).getTime()
    : null;

  const endTime = endDate
    ? new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
      ).getTime()
    : null;

  const hasActiveRange =
    startTime !== null && endTime !== null && endTime > startTime;

  // Formatted trigger button display label
  const displayLabel = React.useMemo(() => {
    if (startDate && endDate) {
      if (startDate.getTime() === endDate.getTime()) {
        return formatDateShort(startDate);
      }
      return `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`;
    }
    if (startDate) {
      return formatDateShort(startDate);
    }
    return "Tanggal";
  }, [startDate, endDate]);

  const hasRangeSelected = startDate !== null || endDate !== null;

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block text-left", className)}
    >
      {/* 1. Trigger Button: Matches Gambar 1 & Gambar 2 */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={cn(
          "inline-flex items-center gap-2.5 px-3.5 h-10 rounded-lg bg-deep-blue-900/60 hover:bg-deep-blue-900 border border-deep-blue-700/80 text-sm font-semibold text-white transition-all shadow-sm cursor-pointer select-none",
          isOpen && "ring-1 ring-deep-blue-600 bg-deep-blue-900",
          hasRangeSelected ? "text-white" : "text-gray-200"
        )}
      >
        <FluentCalendarIcon className="w-4 h-4 text-gray-300 shrink-0" />
        <span className="font-semibold tracking-wide">{displayLabel}</span>

        {/* Clear 'X' icon if range is actively selected (Gambar 1) */}
        {hasRangeSelected && (
          <span
            role="button"
            tabIndex={0}
            onClick={handleClear}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleClear();
              }
            }}
            title="Hapus tanggal"
            aria-label="Hapus rentang tanggal"
            className="ml-1 p-0.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <DismissIcon className="w-3.5 h-3.5" />
          </span>
        )}
      </button>

      {/* 2. Dropdown Popover: Responsive for tablet & mobile */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Pilih Rentang Tanggal"
          className="absolute right-0 top-12 z-50 rounded-2xl bg-deep-blue-950 border border-deep-blue-700/80 shadow-2xl flex flex-col lg:flex-row overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150 font-sans w-[min(300px,calc(100vw-2rem))] sm:w-[320px] lg:w-[460px] max-w-[calc(100vw-2rem)]"
        >
          {/* Preset Options: Top horizontal scroll on mobile & tablet, Left vertical column on desktop */}
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible p-2 sm:p-2.5 lg:p-3.5 gap-1.5 border-b lg:border-b-0 lg:border-r border-deep-blue-700/60 bg-deep-blue-950 shrink-0 lg:w-34 lg:justify-center [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {PRESET_OPTIONS.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={cn(
                    "whitespace-nowrap px-3 py-1.5 lg:py-2 text-left text-label-xs transition-colors rounded-lg flex items-center cursor-pointer select-none shrink-0",
                    isActive
                      ? "bg-white/10 text-white font-semibold shadow-xs border border-deep-blue-600/50"
                      : "text-gray-400 hover:text-white hover:bg-white/5 font-medium border border-transparent"
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Right Column: Calendar Header + Matrix */}
          <div className="flex-1 flex flex-col bg-deep-blue-950 min-w-0">
            {/* Header: < Month > and [ Clear ] button */}
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-deep-blue-700/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Bulan Sebelumnya"
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ChevronLeftIcon />
                </button>
                <span className="text-sm font-semibold text-white px-1 select-none">
                  {MONTH_NAMES[viewMonth]}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Bulan Berikutnya"
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ChevronRightIcon />
                </button>
              </div>

              {/* Clear Button */}
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1 rounded-full border border-deep-blue-700/80 bg-transparent hover:bg-white/10 text-label-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>

            {/* Days Header & Date Grid */}
            <div className="p-2.5 sm:p-3 lg:p-4 flex flex-col gap-1.5 sm:gap-2 lg:gap-2.5 bg-deep-blue-950">
              {/* Day of Week Headers: Su Mo Tu We Th Fr Sa */}
              <div className="grid grid-cols-7 text-center text-label-xs font-medium text-gray-400">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              {/* Days Matrix with Continuous Range Bar */}
              <div className="grid grid-cols-7 text-center text-label-xs gap-y-1">
                {calendarCells.map((item, idx) => {
                  const colIndex = idx % 7;
                  const cellDate = new Date(item.year, item.month, item.day);
                  const cellTime = cellDate.getTime();

                  const isStart = startTime !== null && cellTime === startTime;
                  const isEnd = endTime !== null && cellTime === endTime;
                  const inRange =
                    startTime !== null &&
                    endTime !== null &&
                    cellTime > startTime &&
                    cellTime < endTime;

                  return (
                    <div
                      key={`${item.year}-${item.month}-${item.day}-${idx}`}
                      className="h-7.5 sm:h-8 lg:h-8.5 flex items-center justify-center relative select-none"
                    >
                      {/* Continuous Range Background Bar */}
                      {hasActiveRange && (
                        <>
                          {isStart && (
                            <div className="absolute inset-y-0 right-0 left-1/2 bg-deep-blue-900" />
                          )}
                          {inRange && (
                            <div
                              className={cn(
                                "absolute inset-y-0 left-0 right-0 bg-deep-blue-900",
                                colIndex === 0 && "rounded-l-lg",
                                colIndex === 6 && "rounded-r-lg"
                              )}
                            />
                          )}
                          {isEnd && (
                            <div className="absolute inset-y-0 left-0 right-1/2 bg-deep-blue-900" />
                          )}
                        </>
                      )}

                      {/* Day Number Button */}
                      <button
                        type="button"
                        onClick={() => handleDayClick(cellDate)}
                        className={cn(
                          "w-7 h-7 sm:w-7.5 sm:h-7.5 lg:w-8.5 lg:h-8.5 flex items-center justify-center text-label-xs transition-all relative z-10 select-none cursor-pointer",
                          !item.isCurrentMonth && "text-gray-600 hover:text-gray-400",
                          item.isCurrentMonth &&
                            !isStart &&
                            !isEnd &&
                            !inRange &&
                            "text-gray-200 hover:text-white hover:bg-white/10 rounded-lg font-normal",
                          inRange && "text-white font-bold bg-transparent",
                          (isStart || isEnd) &&
                            "rounded-lg border border-deep-blue-600 bg-deep-blue-900 text-white font-bold shadow-xs"
                        )}
                      >
                        {item.day}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
