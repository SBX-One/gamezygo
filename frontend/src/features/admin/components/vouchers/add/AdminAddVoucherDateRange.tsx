import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminSwitch } from "@/components/admin/AdminSwitch";
import { Button } from "@/components/ui/Button";
import type { AdminAddVoucherFormData } from "../../../types/admin-voucher.types";

export interface AdminAddVoucherDateRangeProps {
  formData: AdminAddVoucherFormData;
  onChange: (fields: Partial<AdminAddVoucherFormData>) => void;
  className?: string;
}

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const DURATION_PRESETS = [
  { id: "1 Hari", label: "1 Hari", days: 1 },
  { id: "2 Hari", label: "2 Hari", days: 2 },
  { id: "1 Minggu", label: "1 Minggu", days: 7 },
  { id: "2 minggu", label: "2 minggu", days: 14 },
  { id: "1 Bulan", label: "1 Bulan", days: 30 },
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

function parseDateString(str?: string): Date | null {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) {
      return new Date(y, m, d);
    }
  }
  return null;
}

function formatDateString(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export function AdminAddVoucherDateRange({
  formData,
  onChange,
  className,
}: AdminAddVoucherDateRangeProps) {
  // Calendar active view month/year (defaults to parsed startDate or current month)
  const [viewDate, setViewDate] = React.useState<Date>(() => {
    const parsed = parseDateString(formData.startDate);
    if (parsed) {
      return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    }
    return new Date();
  });

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Navigation handlers for < and > buttons
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectPreset = (preset: (typeof DURATION_PRESETS)[0]) => {
    const baseDate = parseDateString(formData.startDate) || new Date();
    const end = new Date(baseDate.getTime() + preset.days * 24 * 60 * 60 * 1000);

    onChange({
      durationPreset: preset.id,
      startDate: formatDateString(baseDate),
      endDate: formatDateString(end),
    });

    setViewDate(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));
  };

  const handleClearCalendar = () => {
    onChange({
      startDate: "",
      endDate: "",
      durationPreset: "",
    });
  };

  const handleDateClick = (cellDate: Date) => {
    const startObj = parseDateString(formData.startDate);
    const endObj = parseDateString(formData.endDate);

    if (!startObj || (startObj && endObj)) {
      onChange({
        startDate: formatDateString(cellDate),
        endDate: "",
        durationPreset: "",
      });
    } else {
      if (cellDate.getTime() < startObj.getTime()) {
        onChange({
          startDate: formatDateString(cellDate),
          endDate: formatDateString(startObj),
          durationPreset: "",
        });
      } else {
        onChange({
          endDate: formatDateString(cellDate),
          durationPreset: "",
        });
      }
    }
  };

  // Generate dynamic calendar matrix for active viewYear & viewMonth
  const calendarCells = React.useMemo(() => {
    const cells: CalendarCell[] = [];
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    // 1. Trailing days from previous month
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

    // 3. Leading days for next month to complete 35 or 42 grid cells
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

  // Normalized timestamps for date range matching
  const startDateObj = parseDateString(formData.startDate);
  const endDateObj = parseDateString(formData.endDate);

  const startTime = startDateObj
    ? new Date(
        startDateObj.getFullYear(),
        startDateObj.getMonth(),
        startDateObj.getDate()
      ).getTime()
    : null;

  const endTime = endDateObj
    ? new Date(
        endDateObj.getFullYear(),
        endDateObj.getMonth(),
        endDateObj.getDate()
      ).getTime()
    : null;

  const hasActiveRange = startTime !== null && endTime !== null && endTime > startTime;

  return (
    <div className={cn("space-y-4 font-sans select-none", className)}>
      {/* Header: Valid Date Range + Switches */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-3">
        <h2 className="text-[20px] leading-[1.2] font-semibold text-white tracking-tight">
          Valid Date Range
        </h2>

        {/* Dual toggle switches */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <AdminSwitch
              checked={formData.onlyForBundle ?? false}
              onChange={(checked) => onChange({ onlyForBundle: checked })}
              ariaLabel="Only for Bundle"
            />
            <span className="text-sm font-medium text-white">
              Only for Bundle
            </span>
          </div>

          <div className="flex items-center gap-3">
            <AdminSwitch
              checked={formData.applicableToBundle ?? true}
              onChange={(checked) =>
                onChange({
                  applicableToBundle: checked,
                  applicableToSubs: checked,
                })
              }
              ariaLabel="Applicable to Bundle"
            />
            <span className="text-sm font-medium text-white">
              Applicable to Bundle
            </span>
          </div>
        </div>
      </div>

      {/* Content Layout: Left Calendar Widget (deep blue 950 content + deep blue 900 header) + Right Date Inputs */}
      <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
        {/* Left: Interactive Calendar Picker Widget */}
        <div className="w-full sm:w-110 rounded-lg bg-deep-blue-950 border border-deep-blue-700/80 overflow-hidden flex flex-row shadow-sm shrink-0">
          {/* Preset Sidebar (1 Hari, 2 Hari, 1 Minggu, 2 minggu, 1 Bulan) */}
          <div className="w-30 shrink-0 p-3 border-r border-deep-blue-700/80 flex flex-col gap-1.5 bg-deep-blue-900/40">
            {DURATION_PRESETS.map((preset) => {
              const isActive = formData.durationPreset === preset.id;
              if (isActive) {
                return (
                  <Button
                    key={preset.id}
                    variant="active"
                    size="xs"
                    fullWidth
                    onClick={() => handleSelectPreset(preset)}
                    className="w-full justify-start px-3 py-2 text-label-xs font-semibold text-white [&_.button-main-text]:text-white! hover:[&_.button-main-text]:text-white! active:[&_.button-main-text]:text-white! rounded-lg border border-deep-blue-700 bg-(image:--gradient-surface-secondary-default) shadow-xs"
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
                  className="w-full px-3 py-2 text-left text-label-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center transition-colors cursor-pointer select-none"
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Right: Calendar View with Header (deep-blue-900) and Content (deep-blue-950) */}
          <div className="flex-1 min-w-0 flex flex-col bg-deep-blue-950">
            {/* Header: < Month > + Clear Button (deep blue 900 background) */}
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

              <button
                type="button"
                onClick={handleClearCalendar}
                className="px-4 py-1 rounded-full border border-[#263148] bg-transparent hover:bg-white/10 text-label-xs font-semibold text-white transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>

            {/* Content: Days Header & Grid (deep blue 950 background) */}
            <div className="p-4 space-y-3 bg-deep-blue-950">
              {/* Days Header: Su Mo Tu We Th Fr Sa */}
              <div className="grid grid-cols-7 text-center text-[12px] font-medium text-[#7C88A2]">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              {/* Days Matrix with Connected Range Bar (deep-blue-900 selected dates) */}
              <div className="grid grid-cols-7 text-center text-label-xs gap-y-1">
                {calendarCells.map((item, idx) => {
                  const colIndex = idx % 7; // 0 = Su, 6 = Sa
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

                      <button
                        type="button"
                        onClick={() => handleDateClick(cellDate)}
                        className={cn(
                          "w-9 h-9 flex items-center justify-center text-label-xs transition-all relative z-10 select-none cursor-pointer",
                          !item.isCurrentMonth && "text-[#3D4760] hover:text-slate-400",
                          item.isCurrentMonth &&
                            !isStart &&
                            !isEnd &&
                            !inRange &&
                            "text-slate-200 hover:text-white hover:bg-white/5 rounded-lg font-normal",
                          inRange &&
                            "text-white font-bold bg-transparent",
                          (isStart || isEnd) &&
                            "rounded-lg border border-deep-blue-700 bg-deep-blue-900 text-white font-bold shadow-xs"
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

        {/* Right: Start Date & End Date Fields (Size Small: 40px) */}
        <div className="flex-1 w-full max-w-105 space-y-4">
          {/* Start Date */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] leading-[1.4] font-normal text-gray-400 uppercase tracking-wider">
              START DATE
            </label>
            <div className="min-h-10 h-10 px-3 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-body-xs font-medium text-white flex items-center justify-between cursor-pointer hover:border-gray-500 transition-colors">
              <span>{formData.startDate || "Pilih tanggal mulai"}</span>
              <ChevronDownIcon className="text-gray-400" />
            </div>
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] leading-[1.4] font-normal text-gray-400 uppercase tracking-wider">
              END DATE
            </label>
            <div className="min-h-10 h-10 px-3 bg-deep-blue-900 border border-deep-blue-700 rounded-lg text-body-xs font-medium text-white flex items-center justify-between cursor-pointer hover:border-gray-500 transition-colors">
              <span>{formData.endDate || "Pilih tanggal berakhir"}</span>
              <ChevronDownIcon className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
