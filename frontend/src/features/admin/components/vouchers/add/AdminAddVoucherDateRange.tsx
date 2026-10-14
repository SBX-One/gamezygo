import * as React from "react";
import { cn } from "@/lib/utils";
import { AdminSwitch } from "@/components/admin/AdminSwitch";
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

export function AdminAddVoucherDateRange({
  formData,
  onChange,
  className,
}: AdminAddVoucherDateRangeProps) {
  const [selectedDayStart, setSelectedDayStart] = React.useState<number>(8);
  const [selectedDayEnd, setSelectedDayEnd] = React.useState<number>(15);

  const handleSelectPreset = (preset: (typeof DURATION_PRESETS)[0]) => {
    onChange({
      durationPreset: preset.id,
      startDate: "08/09/2026",
      endDate:
        preset.days === 1
          ? "09/09/2026"
          : preset.days === 2
          ? "10/09/2026"
          : preset.days === 7
          ? "15/09/2026"
          : preset.days === 14
          ? "22/09/2026"
          : "08/10/2026",
    });
    setSelectedDayStart(8);
    setSelectedDayEnd(Math.min(30, 8 + preset.days));
  };

  const handleClearCalendar = () => {
    setSelectedDayStart(0);
    setSelectedDayEnd(0);
    onChange({
      startDate: "",
      endDate: "",
      durationPreset: "",
    });
  };

  const handleDateClick = (day: number) => {
    if (day < 1 || day > 30) return;
    if (selectedDayStart === 0 || selectedDayEnd !== 0) {
      setSelectedDayStart(day);
      setSelectedDayEnd(0);
      onChange({
        startDate: `${String(day).padStart(2, "0")}/09/2026`,
        endDate: "",
      });
    } else {
      if (day < selectedDayStart) {
        setSelectedDayStart(day);
        setSelectedDayEnd(selectedDayStart);
        onChange({
          startDate: `${String(day).padStart(2, "0")}/09/2026`,
          endDate: `${String(selectedDayStart).padStart(2, "0")}/09/2026`,
        });
      } else {
        setSelectedDayEnd(day);
        onChange({
          endDate: `${String(day).padStart(2, "0")}/09/2026`,
        });
      }
    }
  };

  // Calendar dates matrix for Sept 2026
  // Days of week: Su Mo Tu We Th Fr Sa
  // Aug 30, 31, then Sept 1-30, then Oct 1, 2, 3
  const calendarDays = [
    { day: 30, isCurrentMonth: false },
    { day: 31, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },

    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },

    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },

    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },

    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
    { day: 2, isCurrentMonth: false },
    { day: 3, isCurrentMonth: false },
  ];

  return (
    <div className={cn("space-y-4 font-sans select-none", className)}>
      {/* Header: Valid Date Range + Switches (Matching Image 4: Only for Bundle & Applicable to Bundle) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Valid Date Range
        </h2>

        {/* Dual toggle switches (Matching Image 4) */}
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
                onChange({ applicableToBundle: checked, applicableToSubs: checked })
              }
              ariaLabel="Applicable to Bundle"
            />
            <span className="text-sm font-medium text-white">
              Applicable to Bundle
            </span>
          </div>
        </div>
      </div>

      {/* Content Layout (Matching Image 5): Left Calendar Widget + Right Date Inputs */}
      <div className="flex flex-col lg:flex-row items-start gap-8 w-full">
        {/* Left: Interactive Calendar Picker Widget (Image 5) */}
        <div className="w-full sm:w-[430px] rounded-2xl bg-[#0D0F18] border border-white/10 overflow-hidden flex flex-row shadow-sm shrink-0">
          {/* Preset Sidebar (1 Hari, 2 Hari, 1 Minggu, 2 minggu, 1 Bulan) */}
          <div className="w-[115px] shrink-0 p-2.5 border-r border-deep-blue-700/60 flex flex-col gap-1.5 bg-[#0A0C13]/60">
            {DURATION_PRESETS.map((preset) => {
              const isActive = formData.durationPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={cn(
                    "w-full px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer select-none",
                    isActive
                      ? "bg-[#181A24] text-white font-semibold shadow-xs border border-white/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Right: Calendar Grid View */}
          <div className="flex-1 min-w-0 p-3.5 space-y-3">
            {/* Calendar Month Header: < Sept > + Clear button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Bulan Sebelumnya"
                  className="p-1 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeftIcon />
                </button>
                <span className="text-xs font-bold text-white px-1">Sept</span>
                <button
                  type="button"
                  aria-label="Bulan Berikutnya"
                  className="p-1 rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronRightIcon />
                </button>
              </div>

              <button
                type="button"
                onClick={handleClearCalendar}
                className="px-2.5 py-1 rounded-lg border border-white/10 bg-[#161822] hover:bg-[#1E202B] text-[11px] font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>

            {/* Days Header: Su Mo Tu We Th Fr Sa */}
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
              className="text-center text-[11px] font-semibold text-gray-400"
            >
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Days Matrix */}
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", rowGap: "4px" }}
              className="text-center text-xs"
            >
              {calendarDays.map((item, idx) => {
                const isStart =
                  item.isCurrentMonth && item.day === selectedDayStart;
                const isEnd =
                  item.isCurrentMonth && item.day === selectedDayEnd;
                const inRange =
                  item.isCurrentMonth &&
                  selectedDayStart > 0 &&
                  selectedDayEnd > 0 &&
                  item.day > selectedDayStart &&
                  item.day < selectedDayEnd;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      item.isCurrentMonth && handleDateClick(item.day)
                    }
                    disabled={!item.isCurrentMonth}
                    style={{ width: "28px", height: "28px" }}
                    className={cn(
                      "mx-auto rounded-lg flex items-center justify-center text-xs transition-colors select-none",
                      !item.isCurrentMonth && "text-gray-600 cursor-not-allowed",
                      item.isCurrentMonth &&
                        !isStart &&
                        !isEnd &&
                        !inRange &&
                        "text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer",
                      inRange && "bg-white/10 text-white font-medium rounded-none",
                      (isStart || isEnd) &&
                        "bg-[#1E202B] border border-white/30 text-white font-bold shadow-xs cursor-pointer"
                    )}
                  >
                    {item.day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Start Date & End Date Fields (Matching Image 5) */}
        <div className="flex-1 w-full max-w-[420px] space-y-4">
          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
              START DATE
            </label>
            <div className="h-11 px-4 bg-[#0D0F18] border border-deep-blue-700 rounded-xl text-sm font-medium text-white flex items-center justify-between cursor-pointer">
              <span>{formData.startDate || "Pilih tanggal mulai"}</span>
              <ChevronDownIcon className="text-gray-400" />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-2">
              END DATE
            </label>
            <div className="h-11 px-4 bg-[#0D0F18] border border-deep-blue-700 rounded-xl text-sm font-medium text-white flex items-center justify-between cursor-pointer">
              <span>{formData.endDate || "Pilih tanggal berakhir"}</span>
              <ChevronDownIcon className="text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
