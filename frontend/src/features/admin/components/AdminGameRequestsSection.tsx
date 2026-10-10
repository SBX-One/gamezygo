import * as React from "react";
import Link from "next/link";
import { AdminCard, AdminListItem, AdminEmptyState } from "@/components/admin";
import { MOCK_ADMIN_GAME_REQUESTS } from "../data/admin-mock-data";
import type { AdminGameRequest } from "../types/admin.types";

export interface AdminGameRequestsSectionProps {
  isEmpty?: boolean;
  requests?: AdminGameRequest[];
  totalCount?: number;
  viewAllHref?: string;
  onRequestGame?: () => void;
  className?: string;
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export function AdminGameRequestsSection({
  isEmpty = false,
  requests,
  totalCount,
  viewAllHref = "/admin/requests",
  onRequestGame,
  className,
}: AdminGameRequestsSectionProps) {
  const activeRequests = isEmpty
    ? []
    : requests || MOCK_ADMIN_GAME_REQUESTS;

  const displayCount =
    totalCount !== undefined
      ? totalCount
      : isEmpty
      ? 0
      : activeRequests.length || 40;

  const cardTitle = (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
        GAME REQUEST
      </span>
      <span className="text-sm font-bold text-white">
        {displayCount} Permintaan
      </span>
    </div>
  );

  const headerRight = (
    <Link
      href={viewAllHref}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-200 hover:text-white transition-colors group"
    >
      <span>Lihat Semua</span>
      <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );

  const isRequestsEmpty = activeRequests.length === 0;

  return (
    <AdminCard
      title={cardTitle}
      headerRight={headerRight}
      className={className}
      bodyClassName={
        isRequestsEmpty
          ? "py-16 sm:py-20 flex items-center justify-center"
          : "p-0 divide-y divide-deep-blue-700"
      }
    >
      {isRequestsEmpty ? (
        <AdminEmptyState
          category="Game Request"
          actionLabel="Tambah Request"
          actionIcon={<PlusIcon className="w-4 h-4 text-gray-300" />}
          onAction={onRequestGame}
        />
      ) : (
        activeRequests.map((req) => (
          <AdminListItem
            key={req.id}
            title={req.title}
            badgeText={`${req.requesterCount} orang`}
            imageSrc={req.imageSrc}
            actionLabel="Lihat di Steam"
            actionHref={req.steamUrl}
          />
        ))
      )}
    </AdminCard>
  );
}

