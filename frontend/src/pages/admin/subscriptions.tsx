import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  AdminSubscriptionPlanCard,
  AdminSubscriptionGameListCard,
  AdminSubscriptionTable,
  AdminEditPlanModal,
  AdminEditSubscriptionGamesModal,
} from "@/features/admin/components/subs";
import { ChevronRightIcon } from "@/features/admin/components/catalog/section";
import { Pagination } from "@/components/ui/Pagination";
import {
  INITIAL_SUBSCRIPTION_PLANS,
  SUBSCRIPTION_GAME_STATS,
  SUBSCRIPTION_GAMES,
  MOCK_SUBSCRIBERS,
} from "@/features/admin/data/admin-subscription-mock-data";
import type {
  SubscriptionPlan,
  SubscriberAccount,
  SubscriptionGameStats,
} from "@/features/admin/types/admin-subscription.types";
import type { SectionProduct } from "@/features/admin/types/admin-section.types";

export default function AdminSubscriptionManagementPage() {
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>(
    INITIAL_SUBSCRIPTION_PLANS
  );
  const [gameStats, setGameStats] = React.useState<SubscriptionGameStats>(
    SUBSCRIPTION_GAME_STATS
  );
  const [games, setGames] = React.useState<SectionProduct[]>(
    SUBSCRIPTION_GAMES
  );
  const [subscribers, setSubscribers] = React.useState<SubscriberAccount[]>(
    MOCK_SUBSCRIBERS
  );

  // Pagination state (Separated from table, matching Image 4)
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.max(25, Math.ceil(subscribers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSubscribers = subscribers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Modal states
  const [editingPlan, setEditingPlan] = React.useState<SubscriptionPlan | null>(
    null
  );
  const [isEditGamesModalOpen, setIsEditGamesModalOpen] = React.useState(false);

  // Plan Edit Handler
  const handleSavePlan = (updatedPlan: SubscriptionPlan) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
  };

  // Game List Edit Handler (Matching Image 4 & Image 5)
  const handleSaveGames = (updatedGames: SectionProduct[]) => {
    setGames(updatedGames);
    setGameStats((stats) => ({
      ...stats,
      totalGames: updatedGames.length,
    }));
  };

  // Header Title matching design system: [ ◫ ] | Dashboard > Subs Management
  const headerTitle = (
    <div className="flex items-center gap-2 select-none text-[12px]">
      <Link
        href="/admin/dashboard"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Dashboard
      </Link>
      <ChevronRightIcon className="w-3.5 h-3.5 text-gray-500 shrink-0" />
      <span className="text-white font-semibold">Subs Management</span>
    </div>
  );

  return (
    <>
      <Head>
        <title>Subs Management | Gamezygo Admin</title>
        <meta
          name="description"
          content="Subscription Management Dashboard for Gamezygo"
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="paket"
      >
        <div className="space-y-8 pb-16">
          {/* Section 1: 3 Subscription Plan Cards (Image 2) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <AdminSubscriptionPlanCard
                key={plan.id}
                plan={plan}
                onEdit={(p) => setEditingPlan(p)}
              />
            ))}
          </div>

          {/* Section 2: Total List Game Card (Image 3) */}
          <AdminSubscriptionGameListCard
            totalGames={gameStats.totalGames}
            totalValue={gameStats.totalValue}
            games={games}
            onEditGameList={() => setIsEditGamesModalOpen(true)}
          />

          {/* Section 3: Total Active Subs Table & Separated Pagination (Image 3 & Image 4) */}
          <div className="space-y-6">
            <AdminSubscriptionTable
              subscribers={currentSubscribers}
              totalActiveCount={subscribers.length}
            />

            {/* Separated Pagination Component (Using existing @/components/ui/Pagination) */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="justify-center pt-2"
            />
          </div>
        </div>

        {/* Modal 1: Edit Subscription Plan (Image 1 & Image 2) */}
        <AdminEditPlanModal
          isOpen={Boolean(editingPlan)}
          plan={editingPlan}
          onClose={() => setEditingPlan(null)}
          onSave={handleSavePlan}
        />

        {/* Modal 2: Edit Subscription Games (Image 4 & Image 5) */}
        <AdminEditSubscriptionGamesModal
          isOpen={isEditGamesModalOpen}
          initialAddedGames={games}
          subsWorth={gameStats.totalValue}
          totalGamesCount={gameStats.totalGames}
          onClose={() => setIsEditGamesModalOpen(false)}
          onSave={handleSaveGames}
        />
      </AdminLayout>
    </>
  );
}
