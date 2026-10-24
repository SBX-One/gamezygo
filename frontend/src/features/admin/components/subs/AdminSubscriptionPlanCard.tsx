import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EditPencilIcon } from "../catalog/section/AdminSectionIcons";
import type { SubscriptionPlan } from "../../types/admin-subscription.types";

export interface AdminSubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  onEdit: (plan: SubscriptionPlan) => void;
  className?: string;
}

const PlanIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function AdminSubscriptionPlanCard({
  plan,
  onEdit,
  className,
}: AdminSubscriptionPlanCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-[24px] flex flex-col justify-between shadow-lg select-none transition-all duration-200 hover:border-deep-blue-600",
        className
      )}
    >
      <div>
        {/* Top Header Row: Icon + Title & Duration */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-[10px] bg-deep-blue-900 border border-deep-blue-700 flex items-center justify-center text-gray-300 shrink-0">
              <PlanIcon className="w-4 h-4 text-gray-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-50 tracking-tight">
              {plan.title}
            </h3>
          </div>

          <span className="text-label-xs font-semibold text-gray-400 uppercase tracking-widest">
            {plan.duration}
          </span>
        </div>

        {/* Price Row: "IDR 150,000 / Month" (Exact Figma gap: 48px from header) */}
        <div className="mt-[48px] flex items-baseline">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-50 tracking-tight">
            {plan.price}
          </span>
          <span className="text-sm font-normal text-gray-400 ml-2">
            {plan.period}
          </span>
        </div>

        {/* Benefits List (Exact Figma gap: 32px from price, 16px padding to divider lines) */}
        <div className="mt-[32px] space-y-[16px]">
          {plan.benefits.map((benefit, index) => (
            <div key={index} className="space-y-[16px]">
              <div className="flex items-center gap-[10px] text-label-xs sm:text-sm text-gray-300">
                <CheckIcon className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                <span>{benefit}</span>
              </div>
              <div className="w-full h-px bg-deep-blue-700/60" />
            </div>
          ))}
        </div>
      </div>

      {/* Edit Button at bottom (Exact Figma gap: 32px from benefits, 24px to bottom) */}
      <div className="mt-[32px] pt-[8px]">
        <Button
          type="button"
          variant="outline"
          size="sm"
          fullWidth
          rightIcon={<EditPencilIcon className="w-3.5 h-3.5" />}
          onClick={() => onEdit(plan)}
          className="h-[40px] justify-center gap-2"
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
