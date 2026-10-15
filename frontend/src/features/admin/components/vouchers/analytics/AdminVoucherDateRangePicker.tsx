import * as React from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/Button";

export interface AdminVoucherDateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRange?: (preset: string, startDay?: number, endDay?: number) => void;
  className?: string;
}

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const PRESET_OPTIONS = [
  { id: "hari_ini", label: "Hari Ini", days: 1 },
  { id: "kemarin", label: "Kemarin", days: 1 },
  { id: "minggu_ini", label: "Minggu ini", days: 7 },
  { id: "bulan_ini", label: "Bulan ini", days: 30 },
  { id: "tahun_ini", label: "Tahun ini", days: 365 },
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

export function AdminVoucherDateRangePicker({
  isOpen,
  onClose,
  onSelectRange,
  className,
}: AdminVoucherDateRangePickerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = React.useState<string>("minggu_ini");

  // Default to September 2026 matching Image 2
  const [viewDate, setViewDate] = React.useState<Date>(() => new Date(2026, 8, 1));
  const [startDate, setStartDate] = React.useState<Date | null>(() => new Date(2026, 8, 8));
  const [endDate, setEndDate] = React.useState<Date | null>(() => new Date(2026, 8, 15));

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Month navigation: < and > buttons
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectPreset = (preset: (typeof PRESET_OPTIONS)[0]) => {
    setActivePreset(preset.id);
    const base = new Date(2026, 8, 8);
    let start = base;
    let end = base;

    if (preset.id === "hari_ini") {
      start = new Date(2026, 8, 15);
      end = new Date(2026, 8, 15);
    } else if (preset.id === "kemarin") {
      start = new Date(2026, 8, 14);
      end = new Date(2026, 8, 14);
    } else if (preset.id === "minggu_ini") {
      start = new Date(2026, 8, 8);
      end = new Date(2026, 8, 15);
    } else if (preset.id === "bulan_ini") {
      start = new Date(2026, 8, 1);
      end = new Date(2026, 8, 30);
    } else {
      start = new Date(2026, 0, 1);
      end = new Date(2026, 11, 31);
    }

    setStartDate(start);
    setEndDate(end);
    setViewDate(new Date(start.getFullYear(), start.getMonth(), 1));
    onSelectRange?.(preset.label, start.getDate(), end.getDate());
  };

  const handleClear = () => {
    setActivePreset("");
    setStartDate(null);
    setEndDate(null);
    onSelectRange?.("Tanggal", 0, 0);
  };

  const handleDayClick = (cellDate: Date) => {
    setActivePreset("");
    if (!startDate || (startDate && endDate)) {
      setStartDate(cellDate);
      setEndDate(null);
    } else {
      if (cellDate.getTime() < startDate.getTime()) {
        setStartDate(cellDate);
        setEndDate(startDate);
        onSelectRange?.(
          `${cellDate.getDate()}-${startDate.getDate()} ${MONTH_NAMES[cellDate.getMonth()]}`,
          cellDate.getDate(),
          startDate.getDate()
        );
      } else {
        setEndDate(cellDate);
        onSelectRange?.(
          `${startDate.getDate()}-${cellDate.getDate()} ${MONTH_NAMES[cellDate.getMonth()]}`,
          startDate.getDate(),
          cellDate.getDate()
        );
      }
    }
  };

  // Generate dynamic calendar matrix for active viewMonth & viewYear
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

    // 3. Next month leading days (fill to 35 or 42 grid size)
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

  const hasActiveRange = startTime !== null && endTime !== null && endTime > startTime;

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute right-0 top-12 z-50 rounded-2xl bg-deep-blue-950 border border-deep-blue-700/80 shadow-2xl flex flex-row overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150 font-sans",
        className
      )}
      style={{ width: "475px", maxWidth: "95vw" }}
    >
      {/* 1. Left Column: Presets (Hari Ini, Kemarin, Minggu ini, Bulan ini, Tahun ini) */}
      <div className="w-[138px] shrink-0 p-3.5 border-r border-deep-blue-700/80 bg-deep-blue-900/40 flex flex-col justify-center gap-1.5">
        {PRESET_OPTIONS.map((preset) => {
          const isActive = activePreset === preset.id;
          if (isActive) {
            return (
              <Button
                key={preset.id}
                variant="active"
                size="xs"
                fullWidth
                onClick={() => handleSelectPreset(preset)}
                className="w-full justify-start px-3 py-2 text-xs font-semibold text-white [&_.button-main-text]:text-white! hover:[&_.button-main-text]:text-white! active:[&_.button-main-text]:text-white! rounded-xl border border-deep-blue-700 bg-[image:var(--gradient-surface-secondary-default)] shadow-xs"
              >
                <span className="text-white! font-semibold">{preset.label}</span>
              </Button>
            );
          }

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="w-full px-3 py-2 text-left text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl flex items-center transition-colors cursor-pointer select-none"
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* 2. Right Column: Calendar Grid View with deep-blue-900 Header & deep-blue-950 Content */}
      <div className="flex-1 flex flex-col bg-deep-blue-950">
        {/* Header: < Month > & Clear Button (deep blue 900 background) */}
        <div className="bg-deep-blue-900 px-4 py-3 border-b border-deep-blue-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Bulan Sebelumnya"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronRightIcon />
            </button>
          </div>

          {/* Clear pill button */}
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-1 rounded-full border border-[#263148] bg-transparent hover:bg-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Clear
          </button>
        </div>

        {/* Content: Days Header & Grid (deep blue 950 background) */}
        <div className="p-4 sm:p-5 flex flex-col gap-3.5 bg-deep-blue-950">
          {/* Day of Week Headers: Su Mo Tu We Th Fr Sa */}
          <div className="grid grid-cols-7 text-center text-[12px] font-medium text-[#7C88A2]">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Calendar Days Matrix with Connected Range Bar (deep-blue-900 selected dates) */}
          <div className="grid grid-cols-7 text-center text-xs gap-y-1">
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
                  className="h-9 flex items-center justify-center relative select-none"
                >
                  {/* Continuous Range Background Bar connecting selection (deep-blue-900) */}
                  {hasActiveRange && (
                    <>
                      {isStart && (
                        <div className="absolute inset-y-0 right-0 left-1/2 bg-deep-blue-900" />
                      )}
                      {inRange && (
                        <div
                          className={cn(
                            "absolute inset-y-0 left-0 right-0 bg-deep-blue-900",
                            colIndex === 0 && "rounded-l-xl",
                            colIndex === 6 && "rounded-r-xl"
                          )}
                        />
                      )}
                      {isEnd && (
                        <div className="absolute inset-y-0 left-0 right-1/2 bg-deep-blue-900" />
                      )}
                    </>
                  )}

                  {/* Day Number Cell Button */}
                  <button
                    type="button"
                    onClick={() => handleDayClick(cellDate)}
                    className={cn(
                      "w-9 h-9 flex items-center justify-center text-xs transition-all relative z-10 select-none cursor-pointer",
                      !item.isCurrentMonth && "text-[#3D4760] hover:text-slate-400",
                      item.isCurrentMonth &&
                        !isStart &&
                        !isEnd &&
                        !inRange &&
                        "text-slate-200 hover:text-white hover:bg-white/5 rounded-xl font-normal",
                      inRange &&
                        "text-white font-bold bg-transparent",
                      (isStart || isEnd) &&
                        "rounded-xl border border-deep-blue-700 bg-deep-blue-900 text-white font-bold shadow-xs"
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
  );
}
