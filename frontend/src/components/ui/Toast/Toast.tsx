import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type ToastVariant =
  | "default"
  | "secondary"
  | "primary"
  | "error"
  | "warning"
  | "success";

export const toastVariants = cva(
  "relative flex items-center justify-between gap-4 w-full rounded-lg p-3 transition-all duration-200 select-none  ",
  {
    variants: {
      variant: {
        default:
          "bg-deep-blue-900 text-gray-50 border border-deep-blue-700 [&_.toast-desc]:text-deep-blue-100 [&_.toast-close]:text-deep-blue-100 hover:[&_.toast-close]:text-gray-50",
        secondary:
          "bg-deep-blue-900 text-gray-50 border border-deep-blue-700 [&_.toast-desc]:text-deep-blue-100 [&_.toast-close]:text-deep-blue-100 hover:[&_.toast-close]:text-gray-50",
        primary:
          "bg-[image:var(--gradient-primary-default)] text-gray-50 border border-rose-500/30 [&_.toast-desc]:text-rose-100 [&_.toast-close]:text-gray-50/80 hover:[&_.toast-close]:text-gray-50",
        error:
          "bg-red-900 text-rose-400 border border-red-800/50 [&_.toast-desc]:text-rose-300 [&_.toast-close]:text-rose-400 hover:[&_.toast-close]:text-rose-200",
        warning:
          "bg-yellow-900 text-yellow-500 border border-yellow-800/50 [&_.toast-desc]:text-yellow-600 [&_.toast-close]:text-yellow-500 hover:[&_.toast-close]:text-yellow-300",
        success:
          "bg-green-900 text-green-400 border border-green-800/50 [&_.toast-desc]:text-green-300 [&_.toast-close]:text-green-400 hover:[&_.toast-close]:text-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof toastVariants> {
  /** Judul Toast (Header Text) */
  title?: React.ReactNode;
  /** Deskripsi Toast (Body Text) */
  description?: React.ReactNode;
  /** Icon opsional di sisi kiri */
  icon?: React.ReactNode;
  /** Tombol aksi opsional */
  action?: React.ReactNode;
  /** Callback saat tombol close / dismiss diklik */
  onClose?: () => void;
  /** Apakah tombol close ditampilkan (default: true) */
  showClose?: boolean;
  /** Custom close icon jika ingin mengganti icon default */
  closeIcon?: React.ReactNode;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}

const DefaultCloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M4.39716 4.55394L4.47016 4.46994C4.59715 4.34292 4.7655 4.2657 4.94461 4.2523C5.12372 4.2389 5.30169 4.29023 5.44616 4.39694L5.53016 4.46994L12.0002 10.9389L18.4702 4.46894C18.5394 4.39734 18.6222 4.34025 18.7137 4.30098C18.8052 4.26172 18.9036 4.24108 19.0032 4.24026C19.1028 4.23944 19.2015 4.25846 19.2937 4.29622C19.3859 4.33397 19.4696 4.3897 19.54 4.46015C19.6103 4.53061 19.666 4.61437 19.7037 4.70656C19.7413 4.79875 19.7603 4.89752 19.7593 4.9971C19.7584 5.09669 19.7377 5.19509 19.6983 5.28658C19.659 5.37806 19.6018 5.46079 19.5302 5.52994L13.0612 11.9999L19.5312 18.4699C19.658 18.5971 19.7351 18.7655 19.7483 18.9446C19.7615 19.1237 19.71 19.3016 19.6032 19.4459L19.5302 19.5299C19.4032 19.657 19.2348 19.7342 19.0557 19.7476C18.8766 19.761 18.6986 19.7097 18.5542 19.6029L18.4702 19.5299L12.0002 13.0609L5.53016 19.5309C5.38864 19.6675 5.19915 19.743 5.00251 19.7412C4.80586 19.7394 4.61779 19.6604 4.47879 19.5213C4.3398 19.3822 4.26102 19.194 4.2594 18.9974C4.25778 18.8007 4.33347 18.6113 4.47016 18.4699L10.9392 11.9999L4.46916 5.52994C4.34229 5.40283 4.26525 5.23441 4.25203 5.0553C4.23882 4.8762 4.29032 4.6983 4.39716 4.55394Z"
      fill="currentColor"
    />
  </svg>
);

export function Toast({
  className,
  variant = "default",
  title,
  description,
  icon,
  action,
  onClose,
  showClose = true,
  closeIcon,
  children,
  ref,
  ...props
}: ToastProps) {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {/* 1. Left Icon Slot (Optional) */}
      {icon && (
        <div className="toast-icon shrink-0 mt-0.5 flex items-center justify-center">
          {icon}
        </div>
      )}

      {/* 2. Main Content (Title & Description) */}
      <div className="flex-1 flex flex-col gap-1 min-w-0 pr-2">
        {title && (
          <h4 className="toast-title font-semibold text-body-sm ">
            {title}
          </h4>
        )}
        {(description || children) && (
          <p className="toast-desc text-body-sm ">
            {description || children}
          </p>
        )}
        {action && <div className="toast-action ">{action}</div>}
      </div>

      {/* 3. Close / Dismiss Button */}
      {showClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="toast-close p-1 -mr-1 -mt-1 rounded-lg transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {closeIcon || <DefaultCloseIcon />}
        </button>
      )}
    </div>
  );
}
