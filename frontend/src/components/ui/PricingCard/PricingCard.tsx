import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { PricingCardProps } from "./PricingCard.types";

const DefaultPeopleSearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    {...props}
  >
    <path
      d="M11.91 14H19.753C20.3498 14 20.9221 14.2371 21.344 14.659C21.766 15.081 22.003 15.6533 22.003 16.25V17.155C22.003 17.6954 21.8862 18.2294 21.6607 18.7204C21.4351 19.2115 21.106 19.648 20.696 20C19.13 21.345 16.89 22.002 14 22.002H13.821C13.9719 21.6984 14.0314 21.3575 13.9921 21.0207C13.9529 20.6839 13.8167 20.3658 13.6 20.105L13.489 19.984L11.259 17.76C11.9192 16.625 12.1508 15.2907 11.91 14ZM6.50004 10.5C7.3549 10.5 8.19207 10.7436 8.91355 11.2021C9.63504 11.6606 10.211 12.3152 10.574 13.0891C10.937 13.8631 11.072 14.7244 10.9633 15.5724C10.8546 16.4203 10.5066 17.2197 9.96004 17.877L12.783 20.691C12.9163 20.8248 12.9942 21.004 13.0011 21.1928C13.008 21.3816 12.9435 21.566 12.8203 21.7092C12.6972 21.8524 12.5245 21.9439 12.3369 21.9654C12.1492 21.9869 11.9604 21.9367 11.808 21.825L11.723 21.753L8.82004 18.857C8.22564 19.2143 7.5567 19.4293 6.86547 19.4853C6.17424 19.5413 5.47941 19.4368 4.83523 19.18C4.19105 18.9231 3.61496 18.5208 3.15192 18.0045C2.68889 17.4883 2.35144 16.872 2.16594 16.2037C1.98043 15.5355 1.95188 14.8334 2.08251 14.1524C2.21314 13.4713 2.49942 12.8296 2.919 12.2774C3.33858 11.7252 3.88011 11.2775 4.5013 10.9692C5.1225 10.6609 5.80654 10.5003 6.50004 10.5ZM6.50004 12C5.7044 12 4.94133 12.3161 4.37872 12.8787C3.81612 13.4413 3.50004 14.2044 3.50004 15C3.50004 15.7957 3.81612 16.5587 4.37872 17.1213C4.94133 17.6839 5.7044 18 6.50004 18C7.29569 18 8.05876 17.6839 8.62137 17.1213C9.18397 16.5587 9.50004 15.7957 9.50004 15C9.50004 14.2044 9.18397 13.4413 8.62137 12.8787C8.05876 12.3161 7.29569 12 6.50004 12ZM14 2.005C14.6567 2.005 15.3068 2.13433 15.9135 2.38561C16.5201 2.63688 17.0713 3.00518 17.5356 3.46947C17.9999 3.93376 18.3682 4.48496 18.6194 5.09159C18.8707 5.69822 19 6.3484 19 7.005C19 7.66161 18.8707 8.31179 18.6194 8.91842C18.3682 9.52505 17.9999 10.0762 17.5356 10.5405C17.0713 11.0048 16.5201 11.3731 15.9135 11.6244C15.3068 11.8757 14.6567 12.005 14 12.005C12.674 12.005 11.4022 11.4782 10.4645 10.5405C9.52683 9.60286 9.00004 8.33109 9.00004 7.005C9.00004 5.67892 9.52683 4.40715 10.4645 3.46947C11.4022 2.53179 12.674 2.005 14 2.005Z"
      fill="currentColor"
    />
  </svg>
);

const DefaultCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-pale-red-100 shrink-0"
    {...props}
  >
    <path
      d="M4.52985 12.97C4.38767 12.8375 4.19963 12.7654 4.00532 12.7688C3.81102 12.7722 3.62564 12.8509 3.48822 12.9883C3.35081 13.1258 3.2721 13.3111 3.26867 13.5054C3.26524 13.6997 3.33737 13.8878 3.46985 14.03L7.96985 18.53C8.11047 18.6704 8.3011 18.7493 8.49985 18.7493C8.6986 18.7493 8.88922 18.6704 9.02985 18.53L20.0298 7.52997C20.1623 7.38779 20.2344 7.19975 20.231 7.00545C20.2276 6.81114 20.1489 6.62576 20.0115 6.48835C19.8741 6.35093 19.6887 6.27222 19.4944 6.26879C19.3001 6.26537 19.112 6.33749 18.9698 6.46997L8.49985 16.94L4.52985 12.97Z"
      fill="currentColor"
    />
  </svg>
);

const DefaultArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    {...props}
  >
    <path
      d="M13.267 4.20902C13.122 4.07777 12.9314 4.00838 12.7359 4.01566C12.5404 4.02293 12.3555 4.1063 12.2206 4.24797C12.0857 4.38964 12.0115 4.57841 12.0138 4.77402C12.0161 4.96962 12.0948 5.15658 12.233 5.29502L18.484 11.25H3.75C3.55109 11.25 3.36032 11.329 3.21967 11.4697C3.07902 11.6103 3 11.8011 3 12C3 12.1989 3.07902 12.3897 3.21967 12.5303C3.36032 12.671 3.55109 12.75 3.75 12.75H18.484L12.233 18.704C12.0889 18.8411 12.0051 19.0299 12.0001 19.2288C11.9951 19.4277 12.0694 19.6204 12.2065 19.7645C12.3436 19.9087 12.5324 19.9924 12.7313 19.9974C12.9301 20.0024 13.1229 19.9281 13.267 19.791L20.687 12.724C20.8491 12.5697 20.9547 12.3655 20.987 12.144C21.0043 12.0481 21.004 11.9498 20.986 11.854C20.9533 11.6333 20.8477 11.4298 20.686 11.276L13.267 4.20902Z"
      fill="currentColor"
    />
  </svg>
);

const DefaultPhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    {...props}
  >
    <path
      d="M15.5995 14.522C13.2045 17.042 7.09554 10.988 9.49954 8.45799C10.9675 6.91299 9.30954 5.14799 8.39154 3.84899C6.66854 1.41399 2.88754 4.77599 3.00154 6.91499C3.36454 13.661 10.6615 21.655 17.7275 20.957C19.9375 20.739 22.4775 16.747 19.9425 15.288C18.6745 14.558 16.9335 13.118 15.5995 14.521"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function PricingCard({
  type = "primary",
  direction = "vertical",
  icon,
  title,
  price,
  period = "/ Month",
  features = [],
  actionText,
  actionIcon,
  onActionClick,
  secondaryActionText = "Hubungi Admin",
  secondaryActionIcon,
  onSecondaryActionClick,
  expiryInfo,
  dateRangeInfo,
  className,
  ref,
  ...props
}: PricingCardProps) {
  // 1. Paid Subs Card Variant
  if (type === "paid") {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col md:flex-row justify-between md:items-end gap-6 p-6 sm:p-8 rounded-2xl bg-deep-blue-950 border border-white/10 select-none w-full transition-all duration-150 hover:border-neutral-500",
          className
        )}
        {...props}
      >
        {/* Left Section: Header, Price & Expiry Meta */}
        <div className="flex flex-col gap-6 sm:gap-7">
          {/* Header */}
          <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-deep-blue-800 border border-deep-blue-700 p-3 flex items-center justify-center text-deep-blue-100 shrink-0">
    {icon || <DefaultPeopleSearchIcon />}
            </div>
                         <span className="font-semibold text-pale-red-100 text-h4">{title}</span>

          </div>

          {/* Price & Expiry Meta */}
          <div className="flex flex-col gap-8">
            {/* Price */}
            <div className="flex items-baseline gap-1.5 w-fit">
              <span className="text-gradient-heading font-semibold text-h4 leading-tight w-fit">
                {price}{" "}
                {period && (
                  <span className="text-body-sm font-semibold">
                    {period}
                  </span>
                )}
              </span>
            </div>

            {/* Expiry Meta */}
            {(expiryInfo || dateRangeInfo) && (
              <div className="flex items-center gap-5 text-gray-400 text-body-xs font-normal">
                {expiryInfo && <span>{expiryInfo}</span>}
                {expiryInfo && dateRangeInfo && (
                  <span className="text-gradient-secondary select-none font-semibold">|</span>
                )}
                {dateRangeInfo && <span>{dateRangeInfo}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 shrink-0 md:self-end">
          <Button
            variant="primary"
            size="sm"
            onClick={onActionClick}
            className="h-11 px-6 rounded-lg text-body-sm font-medium cursor-pointer"
          >
            {actionText || "Perbarui Sekarang"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={secondaryActionIcon || <DefaultPhoneIcon className="w-4 h-4" />}
            onClick={onSecondaryActionClick}
            className="h-11 px-5 rounded-lg text-body-sm font-medium cursor-pointer border border-white/10 bg-deep-blue-900/40 hover:bg-deep-blue-800/60 hover:border-white/20"
          >
            {secondaryActionText}
          </Button>
        </div>
      </div>
    );
  }

  const isPrimary = type === "primary";
  const buttonVariant = isPrimary ? "primary" : "outline";
  const defaultActionText = actionText || "Subscribe";
  const cardVariantClasses = isPrimary
    ? "border-gradient-primary shadow-lg shadow-rose-950/30"
    : "bg-deep-blue-950 border border-deep-blue-700/60 hover:border-neutral-500";

  // 2. Horizontal Layout (Primary / Secondary)
  if (direction === "horizontal") {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8 p-6 rounded-lg select-none transition-all duration-150 w-full",
          cardVariantClasses,
          className
        )}
        {...props}
      >
        {/* Left Column: Header, Price, Button */}
        <div className="flex flex-col gap-6 shrink-0">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-deep-blue-800 border border-deep-blue-700 p-3 flex items-center justify-center text-deep-blue-100 shrink-0">
                {icon || <DefaultPeopleSearchIcon />}
              </div>
              <span className="font-semibold text-pale-red-100 text-h4">{title}</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 w-fit">
              <span className="text-gradient-heading font-semibold text-h4 leading-tight">
                {price}{" "}
                {period && (
                  <span className="text-body-sm font-semibold">
                    {period}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            variant={buttonVariant}
            size="sm"
            rightIcon={actionIcon || <DefaultArrowRightIcon />}
            onClick={onActionClick}
            className="w-fit cursor-pointer"
          >
            {defaultActionText}
          </Button>
        </div>

        {/* Right Column: Features List */}
        {features.length > 0 && (
          <div className="flex flex-col justify-center shrink-0 min-w-fit">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3.5 py-2.5 sm:py-3 border-b border-b-gradient-secondary last:border-b-0"
              >
                <DefaultCheckIcon />
                <span className="text-pale-red-100 text-body-xs font-normal whitespace-nowrap">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 3. Vertical Layout (Default: Primary / Secondary)
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col justify-between gap-8 sm:gap-12 p-6 rounded-lg select-none w-full h-full transition-all duration-150",
        cardVariantClasses,
        className
      )}
      {...props}
    >
      {/* Header (Icon Badge + Title) */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-deep-blue-800 border border-deep-blue-700 p-3 flex items-center justify-center text-deep-blue-100 shrink-0">
          {icon || <DefaultPeopleSearchIcon />}
        </div>
        <span className="font-semibold text-pale-red-100 text-h4">{title}</span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1.5 w-fit">
        <span className="text-gradient-heading font-semibold text-h4 leading-tight">
          {price}{" "}
          {period && (
            <span className="text-body-sm font-semibold">
              {period}
            </span>
          )}
        </span>
      </div>

      {/* Features List */}
      {features.length > 0 && (
        <div className="flex flex-col">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 py-3 border-b-gradient-secondary"
            >
              <DefaultCheckIcon />
              <span className="text-pale-red-100 text-body-xs font-normal">
                {feature}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Action Button (Full Width at Bottom) */}
      <div className="mt-auto pt-2">
        <Button
          variant={buttonVariant}
          size="sm"
          fullWidth
          rightIcon={actionIcon || <DefaultArrowRightIcon />}
          onClick={onActionClick}
        >
          {defaultActionText}
        </Button>
      </div>
    </div>
  );
}