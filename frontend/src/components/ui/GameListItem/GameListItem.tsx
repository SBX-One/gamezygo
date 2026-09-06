import * as React from "react";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/ui/Pill";
import type { GameListItemProps, GameListItemState } from "./GameListItem.types";

const forceStateClasses: Record<GameListItemState, string> = {
  default: "",
  hover: "bg-surface-secondary-hover brightness-110",
  focus: "ring-2 ring-gray-50/50 ring-offset-1 ring-offset-black",
  pressed: "bg-surface-secondary-pressed scale-98 brightness-90",
  disabled: "bg-gray-700 bg-none border-transparent pointer-events-none opacity-50 cursor-not-allowed",
};

export function GameListItem({
  title,
  imageSrc,
  imageAlt,
  imageSlot,
  discount,
  originalPrice,
  price,
  forceState = "default",
  disabled,
  className,
  ref,
  ...props
}: GameListItemProps) {
  const isComponentDisabled = disabled || forceState === "disabled";

  return (
    <button
      ref={ref}
      type="button"
      disabled={isComponentDisabled}
      className={cn(
        "flex items-center gap-4 p-2 rounded-lg text-left select-none transition-all duration-150 cursor-pointer outline-none w-full",
        "bg-surface-secondary-default border border-white/5",
        "hover:bg-surface-secondary-hover",
        "active:bg-surface-secondary-pressed active:scale-98",
        "focus-visible:ring-2 focus-visible:ring-gray-50",
        "disabled:opacity-50 disabled:pointer-events-none disabled:bg-gray-700 disabled:bg-none disabled:border-transparent",
        forceStateClasses[forceState],
        className
      )}
      {...props}
    >
      {/* 1. Game Cover Image (Min width 66px -> w-16.5, height auto adjusts to text) */}
      <div className="w-16.5 min-w-16.5 self-stretch rounded-md overflow-hidden bg-deep-blue-950 shrink-0 flex items-center justify-center">
        {imageSlot ? (
          imageSlot
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt || (typeof title === "string" ? title : "Game cover")}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full bg-deep-blue-800 flex items-center justify-center text-gray-500 text-label-xs">
            Game
          </div>
        )}
      </div>

      {/* 2. Text & Pricing Info */}
      <div className="flex flex-col justify-between flex-1 min-w-0 gap-3">
        {/* Game Title */}
        <h3 className="text-body-md font-semibold text-gray-50 tracking-normal truncate">
          {title}
        </h3>

        {/* Bottom Row: Discount Pill & Prices */}
        <div className="flex items-center justify-between gap-2">
          {/* Discount Pill */}
          <div>
            {discount ? (
              <Pill variant="secondary" size="xs" className="">
                {discount}
              </Pill>
            ) : null}
          </div>

          {/* Strikethrough & Final Price */}
          <div className="flex flex-col items-end shrink-0 leading-tight">
            {originalPrice && (
              <span className="text-body-xs text-gray-400 line-through">
                {originalPrice}
              </span>
            )}
            <span className="text-body-sm font-semibold text-pale-red-100">
              {price}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
