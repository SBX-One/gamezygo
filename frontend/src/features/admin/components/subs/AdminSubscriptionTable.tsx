import * as React from "react";
import { cn } from "@/lib/utils";
import type { SubscriberAccount } from "../../types/admin-subscription.types";

export interface AdminSubscriptionTableProps {
  subscribers: SubscriberAccount[];
  totalActiveCount?: number;
  className?: string;
}

const MoreVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <circle cx="12" cy="5" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="12" cy="19" r="1.8" />
  </svg>
);

export function AdminSubscriptionTable({
  subscribers,
  totalActiveCount = 105,
  className,
}: AdminSubscriptionTableProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-deep-blue-950 border border-deep-blue-700 shadow-lg select-none overflow-hidden",
        className
      )}
    >
      {/* Top Header Bar (Matching Image 3 & Image 4) */}
      <div className="px-6 py-4.5 bg-deep-blue-900 border-b border-deep-blue-700">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          TOTAL ACTIVE SUBS :{" "}
          <span className="text-gray-50 font-bold tracking-normal">
            {totalActiveCount} Accounts
          </span>
        </span>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300 border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-deep-blue-700 text-xs font-semibold text-gray-300 select-none">
              <th className="py-4 px-6 font-semibold">User ID</th>
              <th className="py-4 px-6 font-semibold">User Email</th>
              <th className="py-4 px-6 font-semibold">Account Created</th>
              <th className="py-4 px-6 font-semibold">Subs End</th>
              <th className="py-4 px-6 text-right w-12" aria-label="Aksi" />
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-deep-blue-700/60">
            {subscribers.map((sub) => (
              <tr
                key={sub.id}
                className="transition-colors hover:bg-deep-blue-900/30"
              >
                {/* Column 1: User ID */}
                <td className="py-4 px-6 font-semibold text-gray-100 text-xs sm:text-sm">
                  {sub.id}
                </td>

                {/* Column 2: User Email */}
                <td className="py-4 px-6 text-gray-300 text-xs sm:text-sm">
                  {sub.email}
                </td>

                {/* Column 3: Account Created */}
                <td className="py-4 px-6 text-gray-400 text-xs sm:text-sm font-mono">
                  {sub.accountCreated}
                </td>

                {/* Column 4: Subs End */}
                <td className="py-4 px-6 text-gray-400 text-xs sm:text-sm font-mono">
                  {sub.subsEnd}
                </td>

                {/* Column 5: 3-dots Menu Action */}
                <td className="py-4 px-6 text-right">
                  <button
                    type="button"
                    title="Menu opsi"
                    className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-deep-blue-900 transition-colors cursor-pointer"
                  >
                    <MoreVerticalIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
