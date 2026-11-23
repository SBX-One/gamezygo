import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { InstructionTemplate } from "../../types/admin-instruction.types";

export interface AdminInstructionDetailViewProps {
  template: InstructionTemplate;
  onChangeTemplate?: () => void;
  onCreateNewTemplate?: () => void;
  className?: string;
}

export function AdminInstructionDetailView({
  template,
  onChangeTemplate,
  onCreateNewTemplate,
  className,
}: AdminInstructionDetailViewProps) {
  return (
    <div
      className={cn(
        "w-full rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-6 sm:p-7 flex flex-col select-none font-sans shadow-xs",
        className
      )}
    >
      {/* Top Header Row (Matching Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-deep-blue-700/60">
        {/* Left: Title + Created at */}
        <div className="flex flex-col">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {template.title}
          </h2>
          <span className="text-label-xs text-gray-400 font-normal mt-0.5">
            Created at : {template.createdAt}
          </span>
        </div>

        {/* Right: Last edit timestamp + Action Buttons (Button outline xs) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-label-xs text-gray-400 font-normal mr-2">
            {template.lastEdit}
          </span>

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onChangeTemplate}
            className="px-3.5 py-1.5"
          >
            Change Template
          </Button>

          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onCreateNewTemplate}
            className="px-3.5 py-1.5"
          >
            Create New Template
          </Button>
        </div>
      </div>

      {/* Steps Box with Full-Height Vertical Red Accent Line (bg-deep-blue-900 matching Image 2 & 3) */}
      <div className="mt-5 rounded-lg bg-deep-blue-900 border border-deep-blue-700 p-5 sm:p-6 flex flex-row items-stretch gap-4.5 shadow-xs">
        {/* Continuous Red Accent Bar */}
        <div className="w-1 bg-[#DF3848] rounded-full shrink-0 self-stretch" />

        {/* Steps List */}
        <div className="flex-1 min-w-0 flex flex-col">
          {template.steps.map((step, idx) => (
            <React.Fragment key={step.stepNumber}>
              <div className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  LANGKAH {step.stepNumber}
                </span>
                <h4 className="text-label-xs sm:text-sm font-semibold text-white tracking-tight">
                  {step.title}
                </h4>
                <p className="text-label-xs text-gray-400 font-normal leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < template.steps.length - 1 && (
                <div className="w-full h-px bg-deep-blue-700/60 my-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
