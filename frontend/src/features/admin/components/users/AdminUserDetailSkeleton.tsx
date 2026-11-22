import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableHead,
  AdminTableCell,
} from "@/components/admin/AdminTable";

export interface AdminUserDetailSkeletonProps {
  className?: string;
}

export function AdminUserDetailSkeleton({ className }: AdminUserDetailSkeletonProps) {
  return (
    <div className={cn("w-full space-y-6 select-none animate-pulse", className)}>
      {/* 1. Profile Top Card Skeleton */}
      <div className="w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Avatar + Username + Email */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/10 border border-deep-blue-700 shrink-0" />
          <div className="space-y-2">
            <div className="w-36 h-5 rounded bg-white/10" />
            <div className="w-48 h-3.5 rounded bg-white/10" />
          </div>
        </div>

        {/* Right: Status Badge + 3 Action Buttons */}
        <div className="flex flex-col md:items-end justify-between gap-4">
          <div className="w-20 h-6 rounded-full bg-white/10" />
          <div className="flex items-center gap-2.5">
            <div className="w-20 h-8 rounded-lg bg-white/10" />
            <div className="w-16 h-8 rounded-lg bg-white/10" />
            <div className="w-24 h-8 rounded-lg bg-white/10" />
          </div>
        </div>
      </div>

      {/* 2. Three Metric Cards: LIFETIME VALUE, CURRENT POINTS, SUBS DURATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Card 1: LIFETIME VALUE */}
        <div className="rounded-lg border border-deep-blue-700 bg-deep-blue-950 p-5 flex flex-col justify-between">
          <div className="border-b border-deep-blue-700/60 pb-3 mb-4">
            <div className="w-28 h-3.5 rounded bg-white/10" />
          </div>
          <div className="w-36 h-8 rounded bg-white/10" />
        </div>

        {/* Card 2: CURRENT POINTS */}
        <div className="rounded-lg border border-deep-blue-700 bg-deep-blue-950 p-5 flex flex-col justify-between">
          <div className="border-b border-deep-blue-700/60 pb-3 mb-4">
            <div className="w-28 h-3.5 rounded bg-white/10" />
          </div>
          <div className="w-24 h-8 rounded bg-white/10" />
        </div>

        {/* Card 3: SUBS DURATION */}
        <div className="rounded-lg border border-deep-blue-700 bg-deep-blue-950 p-5 flex flex-col justify-between">
          <div className="border-b border-deep-blue-700/60 pb-3 mb-4">
            <div className="w-28 h-3.5 rounded bg-white/10" />
          </div>
          <div className="w-28 h-8 rounded bg-white/10" />
        </div>
      </div>

      {/* 3. TOTAL DEVICE LOGIN Table Skeleton */}
      <div className="w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden">
        <div className="px-6 py-4.5 border-b border-deep-blue-700/80 bg-deep-blue-950 flex items-center">
          <div className="w-48 h-4 rounded bg-white/10" />
        </div>
        <AdminTable>
          <AdminTableHeader className="bg-deep-blue-900 border-b border-deep-blue-700">
            <AdminTableRow className="hover:bg-transparent">
              <AdminTableHead className="py-3.5 px-6"><div className="w-20 h-3 rounded bg-white/10" /></AdminTableHead>
              <AdminTableHead className="py-3.5 px-6"><div className="w-20 h-3 rounded bg-white/10" /></AdminTableHead>
              <AdminTableHead className="py-3.5 px-6"><div className="w-20 h-3 rounded bg-white/10" /></AdminTableHead>
              <AdminTableHead className="py-3.5 px-6"><div className="w-20 h-3 rounded bg-white/10" /></AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody className="divide-y divide-deep-blue-700/60">
            {Array.from({ length: 4 }).map((_, i) => (
              <AdminTableRow key={`dev-skel-${i}`} className="border-b border-deep-blue-700/50">
                <AdminTableCell className="py-4 px-6"><div className="w-28 h-3.5 rounded bg-white/10" /></AdminTableCell>
                <AdminTableCell className="py-4 px-6"><div className="w-36 h-3.5 rounded bg-white/10" /></AdminTableCell>
                <AdminTableCell className="py-4 px-6"><div className="w-28 h-3.5 rounded bg-white/10" /></AdminTableCell>
                <AdminTableCell className="py-4 px-6"><div className="w-32 h-3.5 rounded bg-white/10" /></AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>

      {/* 4. TOTAL PRODUCT Table Skeleton */}
      <div className="w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden">
        <div className="px-6 py-4.5 border-b border-deep-blue-700/80 bg-deep-blue-950 flex items-center">
          <div className="w-44 h-4 rounded bg-white/10" />
        </div>
        <AdminTable>
          <AdminTableHeader className="bg-deep-blue-900 border-b border-deep-blue-700">
            <AdminTableRow className="hover:bg-transparent">
              <AdminTableHead className="py-3.5 px-6"><div className="w-24 h-3 rounded bg-white/10" /></AdminTableHead>
              <AdminTableHead className="py-3.5 px-6"><div className="w-24 h-3 rounded bg-white/10" /></AdminTableHead>
              <AdminTableHead className="py-3.5 px-6"><div className="w-24 h-3 rounded bg-white/10" /></AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody className="divide-y divide-deep-blue-700/60">
            {Array.from({ length: 3 }).map((_, i) => (
              <AdminTableRow key={`prod-skel-${i}`} className="border-b border-deep-blue-700/50">
                <AdminTableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-12 rounded-lg bg-white/10 shrink-0" />
                    <div className="w-36 h-3.5 rounded bg-white/10" />
                  </div>
                </AdminTableCell>
                <AdminTableCell className="py-4 px-6"><div className="w-36 h-3.5 rounded bg-white/10" /></AdminTableCell>
                <AdminTableCell className="py-4 px-6"><div className="w-32 h-3.5 rounded bg-white/10" /></AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>

      {/* 5. RECENT TRANSACTIONS Table Skeleton */}
      <div className="w-full rounded-lg border border-deep-blue-700 bg-deep-blue-950 overflow-hidden">
        <div className="px-6 py-4.5 border-b border-deep-blue-700/80 bg-deep-blue-950 flex items-center">
          <div className="w-48 h-4 rounded bg-white/10" />
        </div>
        <AdminTable>
          <AdminTableHeader className="bg-deep-blue-900 border-b border-deep-blue-700">
            <AdminTableRow className="hover:bg-transparent">
              <AdminTableHead className="py-3.5 px-6"><div className="w-24 h-3 rounded bg-white/10" /></AdminTableHead>
              <AdminTableHead className="py-3.5 px-6"><div className="w-24 h-3 rounded bg-white/10" /></AdminTableHead>
              <AdminTableHead className="py-3.5 px-6"><div className="w-24 h-3 rounded bg-white/10" /></AdminTableHead>
              <AdminTableHead className="py-3.5 px-6"><div className="w-20 h-3 rounded bg-white/10" /></AdminTableHead>
              <AdminTableHead className="py-3.5 px-6"><div className="w-16 h-3 rounded bg-white/10" /></AdminTableHead>
              <AdminTableHead className="py-3.5 px-6"><div className="w-16 h-3 rounded bg-white/10" /></AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody className="divide-y divide-deep-blue-700/60">
            {Array.from({ length: 4 }).map((_, i) => (
              <AdminTableRow key={`tx-skel-${i}`} className="border-b border-deep-blue-700/50">
                <AdminTableCell className="py-4 px-6"><div className="w-32 h-3.5 rounded bg-white/10" /></AdminTableCell>
                <AdminTableCell className="py-4 px-6"><div className="w-40 h-3.5 rounded bg-white/10" /></AdminTableCell>
                <AdminTableCell className="py-4 px-6"><div className="w-28 h-3.5 rounded bg-white/10" /></AdminTableCell>
                <AdminTableCell className="py-4 px-6"><div className="w-24 h-3.5 rounded bg-white/10" /></AdminTableCell>
                <AdminTableCell className="py-4 px-6"><div className="w-28 h-3.5 rounded bg-white/10" /></AdminTableCell>
                <AdminTableCell className="py-4 px-6"><div className="w-20 h-6 rounded-full bg-white/10" /></AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>
    </div>
  );
}
