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
  AdminSubscriptionSkeleton,
} from "@/features/admin/components/subs";
import { ChevronRightIcon } from "@/features/admin/components/catalog/section";
import { Pagination } from "@/components/ui/Pagination";
import {
  useAdminSubscriptions,
  useAdminAvailableSubscriptionGames,
  useUpdateSubscriptionPlan,
  useUpdateSubscriptionGames,
} from "@/hooks/use-admin-subscriptions";
import {
  INITIAL_SUBSCRIPTION_PLANS,
  SUBSCRIPTION_GAMES,
  MOCK_SUBSCRIBERS,
} from "@/features/admin/data/admin-subscription-mock-data";
import type {
  SubscriptionPlan,
  SubscriberAccount,
} from "@/features/admin/types/admin-subscription.types";
import type { SectionProduct } from "@/features/admin/types/admin-section.types";

export default function AdminSubscriptionManagementPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Live database queries and mutations
  const {
    plans: serverPlans,
    games: serverGames,
    subscribers: serverSubscribers,
    meta,
    isLoading,
  } = useAdminSubscriptions({
    page: currentPage,
    per_page: itemsPerPage,
  });

  const { data: availableGamesPool, isLoading: isLoadingAvailable } =
    useAdminAvailableSubscriptionGames();

  const updatePlanMutation = useUpdateSubscriptionPlan();
  const updateGamesMutation = useUpdateSubscriptionGames();

  // Active state initialized with server data or graceful fallbacks
  const plans: SubscriptionPlan[] = React.useMemo(() => {
    if (serverPlans && serverPlans.length > 0) return serverPlans;
    return INITIAL_SUBSCRIPTION_PLANS;
  }, [serverPlans]);

  const games: SectionProduct[] = React.useMemo(() => {
    if (Array.isArray(serverGames)) return serverGames;
    return SUBSCRIPTION_GAMES;
  }, [serverGames]);

  // Total worth and total count strictly calculated from the included games
  const effectiveTotalWorth = React.useMemo(() => {
    if (!games.length) return "IDR 0";
    const sum = games.reduce((acc, g) => acc + (Number(g.price) || 0), 0);
    return `IDR ${sum.toLocaleString("id-ID")}`;
  }, [games]);

  const effectiveTotalGames = games.length;

  const subscribers: SubscriberAccount[] = React.useMemo(() => {
    if (Array.isArray(serverSubscribers)) {
      return serverSubscribers;
    }
    return MOCK_SUBSCRIBERS;
  }, [serverSubscribers]);

  const totalPages =
    meta?.last_page ||
    Math.max(1, Math.ceil((meta?.total || subscribers.length) / itemsPerPage));

  // Modal states
  const [editingPlan, setEditingPlan] = React.useState<SubscriptionPlan | null>(
    null
  );
  const [isEditGamesModalOpen, setIsEditGamesModalOpen] = React.useState(false);

  // Plan Edit Handler: Save directly to database
  const handleSavePlan = (updatedPlan: SubscriptionPlan) => {
    updatePlanMutation.mutate(
      {
        id: updatedPlan.id,
        data: {
          title: updatedPlan.title,
          price: updatedPlan.price,
          duration: updatedPlan.duration,
          benefits: updatedPlan.benefits,
        },
      },
      {
        onSuccess: () => {
          setEditingPlan(null);
        },
      }
    );
  };

  // Game List Edit Handler: Sync database games supported for subscription
  const handleSaveGames = (updatedGames: SectionProduct[]) => {
    const gameIds = updatedGames.map((g) => g.id);
    updateGamesMutation.mutate(gameIds, {
      onSuccess: () => {
        setIsEditGamesModalOpen(false);
      },
    });
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
      <span className="text-white font-semibold">Paket / Bundles Management</span>
    </div>
  );

  return (
    <>
      <Head>
        <title>Paket & Bundles Management | Gamezygo Admin</title>
        <meta
          name="description"
          content="Paket and Subscription Bundles Management Dashboard for Gamezygo"
        />
      </Head>

      <AdminLayout
        title={headerTitle}
        activeNavId="paket"
      >
        {isLoading && !serverPlans.length ? (
          <AdminSubscriptionSkeleton />
        ) : (
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
              totalGames={effectiveTotalGames}
              totalValue={effectiveTotalWorth}
              games={games}
              onEditGameList={() => setIsEditGamesModalOpen(true)}
            />

            {/* Section 3: Total Active Subs Table & Separated Pagination (Image 3 & Image 4) */}
            <div className="space-y-6">
              <AdminSubscriptionTable
                subscribers={subscribers}
                totalActiveCount={meta?.total || subscribers.length}
              />

              {/* Separated Pagination Component */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="justify-center pt-2"
                />
              )}
            </div>
          </div>
        )}

        {/* Modal 1: Edit Subscription Plan (Image 1 & Image 2) */}
        <AdminEditPlanModal
          isOpen={Boolean(editingPlan)}
          plan={editingPlan}
          isSaving={updatePlanMutation.isPending}
          onClose={() => setEditingPlan(null)}
          onSave={handleSavePlan}
        />

        {/* Modal 2: Edit Subscription Games (Image 4 & Image 5) */}
        <AdminEditSubscriptionGamesModal
          isOpen={isEditGamesModalOpen}
          initialAddedGames={games}
          availablePool={availableGamesPool}
          isLoadingAvailable={isLoadingAvailable}
          isSaving={updateGamesMutation.isPending}
          subsWorth={effectiveTotalWorth}
          totalGamesCount={effectiveTotalGames}
          onClose={() => setIsEditGamesModalOpen(false)}
          onSave={handleSaveGames}
        />
      </AdminLayout>
    </>
  );
}
