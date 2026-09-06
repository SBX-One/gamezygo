import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon opsional di dalam badge icon kotak */
  icon?: React.ReactNode;
  /** Label atau judul statistik (misal: 'Total Payment') */
  label: React.ReactNode;
  /** Nilai utama atau angka (misal: 'IDR 350,000') */
  value: React.ReactNode;
  /** Deskripsi atau info tambahan di bagian bawah */
  description?: React.ReactNode;
  /** React 19 native ref */
  ref?: React.Ref<HTMLDivElement>;
}

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

export function StatCard({
  icon,
  label,
  value,
  description,
  className,
  ref,
  ...props
}: StatCardProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-8 p-6 rounded-2xl bg-deep-blue-900  select-none w-full",
        className
      )}
      {...props}
    >
      {/* 1. Header (Icon Badge + Label) */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-deep-blue-800 border border-deep-blue-700 p-3 flex items-center justify-center text-deep-blue-100 shrink-0">
          {icon || <DefaultPeopleSearchIcon />}
        </div>
        <span className="font-semibold text-gray-50 text-body-lg">
          {label}
        </span>
      </div>

      {/* 2. Value */}
      <div className="text-gradient-heading font-semibold text-h4 w-full">
        {value}
      </div>

      {/* 3. Optional Description */}
      {description && (
        <div className="text-deep-blue-100 text-body-xs leading-normal">
          {description}
        </div>
      )}
    </div>
  );
}

