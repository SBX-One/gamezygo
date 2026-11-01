import * as React from "react";
import Head from "next/head";
import { StoreLayout } from "@/components/layout";
import { Header, Button, UserRank, Toast, Pill } from "@/components/ui";
import { useLeaderboard, useUserLeaderboardRank } from "@/hooks/use-leaderboard";
import { useAuthStore } from "@/stores/use-auth-store";
import { MOCK_USER } from "@/lib/mock/data";
import router from "next/router";

interface LeaderboardUser {
  rank: number;
  name: string;
  points: number | string;
}

const WEEKLY_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "NgurahffTzy_00", points: 999 },
  { rank: 2, name: "RendyGaming_67", points: 999 },
  { rank: 3, name: "Oporguabolanya000", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
];

const MONTHLY_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "NgurahffTzy_00", points: 999 },
  { rank: 2, name: "RendyGaming_67", points: 999 },
  { rank: 3, name: "Oporguabolanya000", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
];

const LIFETIME_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "NgurahffTzy_00", points: 999 },
  { rank: 2, name: "RendyGaming_67", points: 999 },
  { rank: 3, name: "Oporguabolanya000", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
  { rank: 4, name: "Rendy Mahardika", points: 999 },
];

export default function LeaderboardPage() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // TanStack Query: Leaderboard API
  const { data: weeklyApiRes } = useLeaderboard("weekly");
  const { data: monthlyApiRes } = useLeaderboard("monthly");
  const { data: allTimeApiRes } = useLeaderboard("all-time");
  const { data: userRankApiRes } = useUserLeaderboardRank();

  const weeklyList = React.useMemo(() => {
    if (weeklyApiRes?.data && weeklyApiRes.data.length > 0) {
      return weeklyApiRes.data.map((u) => ({
        rank: u.rank,
        name: u.name,
        points: u.point,
      }));
    }
    return WEEKLY_LEADERBOARD;
  }, [weeklyApiRes]);

  const monthlyList = React.useMemo(() => {
    if (monthlyApiRes?.data && monthlyApiRes.data.length > 0) {
      return monthlyApiRes.data.map((u) => ({
        rank: u.rank,
        name: u.name,
        points: u.point,
      }));
    }
    return MONTHLY_LEADERBOARD;
  }, [monthlyApiRes]);

  const lifetimeList = React.useMemo(() => {
    if (allTimeApiRes?.data && allTimeApiRes.data.length > 0) {
      return allTimeApiRes.data.map((u) => ({
        rank: u.rank,
        name: u.name,
        points: u.point,
      }));
    }
    return LIFETIME_LEADERBOARD;
  }, [allTimeApiRes]);

  const userRankBadge = userRankApiRes?.data?.rank ? `#${userRankApiRes.data.rank}` : "#67";
  const userPointsBadge =
    userRankApiRes?.data?.point !== undefined
      ? `${userRankApiRes?.data?.point} pts`
      : "67 pts";

  const authUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const currentUser = authUser
    ? {
        name: authUser.name,
        email: authUser.email,
        avatarUrl: authUser.avatarUrl,
      }
    : undefined;

  const handleToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const getUserRankClass = (idx: number) =>
    idx === 0
      ? "bg-surface-secondary-default border border-[#2F2F37] rounded-lg px-6 py-3.5 shadow-none hover:border-[#2F2F37] [&_.text-h6]:text-body-md [&_.text-h6]:font-semibold"
      : "bg-transparent border border-transparent rounded-lg px-6 py-3.5 shadow-none hover:bg-white/[0.02] hover:border-transparent [&_.text-h6]:text-body-md [&_.text-h6]:font-semibold";

  return (
    <>
      <Head>
        <title>Leaderboard - Gamezygo</title>
        <meta
          name="description"
          content="Pemilik Koleksi Game Terbesar Saat Ini! Cek posisi dan peringkat kamu di Leaderboard Gamezygo."
        />
      </Head>

      <StoreLayout
        navbarVariant={isAuthenticated ? "login" : "guest"}
        hideSidebar={true}
        activeNavId="leaderboard"
        user={currentUser}
        contentClassName="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      >
        <div className="flex flex-col w-full mx-auto select-none gap-8 sm:gap-12 pb-16">
          {/* ========================================================
              1. HERO SECTION (Menggunakan komponen Header yang sudah ada)
             ======================================================== */}
          <div className="flex justify-center w-full py-6 sm:py-10">
            <Header
              pillText="Promo Musim Panas Telah Datang!"
              title="Pemilik Koleksi Game Terbesar Saat Ini!"
              subtitle="Ingin Langsung Buka Semua? Beli Premium"
              actionLabel="Lihat Premium"
              actionVariant="secondary"
              onActionClick={() => router.push("/bundle")}
              className="w-full sm:max-w-4/7"
            />
          </div>

          <div className="flex flex-col gap-6 w-full">
            {/* ========================================================
                2. PERINGKAT ANDA CARD (Pembungkus dengan background deep-blue-900)
               ======================================================== */}
            <section className="w-full rounded-lg bg-deep-blue-900 border border-gradient-secondary p-4 sm:p-6 lg:p-7 flex flex-col gap-5 sm:gap-6 shadow-xl">
              {/* Header: Icon + Title */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-secondary-default border border-deep-blue-700 flex items-center justify-center text-gray-300 shrink-0">
                  <img
                    src="/assets/svg/fluent_person-add-24-filled.svg"
                    alt="Peringkat"
                    className="w-4.5 h-4.5 filter-[brightness(0)_invert(0.8)]"
                  />
                </div>
                <h2 className="text-body-lg sm:text-h6 font-semibold text-gray-50 tracking-tight">
                  Peringkat Anda
                </h2>
              </div>

              {/* ========================================================
                  USER STATISTICS CARD
                  - Mobile & Tablet (< lg): Vertical Stack (No Scroll-X)
                  - Desktop (lg+): Horizontal Bar with Dividers
                 ======================================================== */}

              {/* 1. MOBILE & TABLET (< lg): VERTICAL STACK */}
              <div className="flex lg:hidden w-full rounded-lg bg-surface-secondary-default border border-deep-blue-700 p-4 sm:p-5 flex-col gap-3.5 select-none">
                {/* Username & Points Header Row */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <span className="text-body-md font-semibold text-gray-50 truncate">
                    {currentUser?.name || "Tamu Gamezygo"}
                  </span>
                  <div className="px-3.5 py-1 rounded-lg border border-gradient-secondary text-label-sm font-semibold text-gray-50 shrink-0">
                    {userPointsBadge}
                  </div>
                </div>

                {/* Vertical Statistics List */}
                <div className="flex flex-col gap-2.5 w-full">
                  {/* Mingguan */}
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <Pill variant="secondary" size="xs">
                        Mingguan
                      </Pill>
                      <span className="text-body-xs text-gray-400">
                        Peringkat Minggu Ini
                      </span>
                    </div>
                    <span className="text-label-md font-bold text-gray-100">
                      {userRankBadge}
                    </span>
                  </div>

                  {/* Bulanan */}
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <Pill variant="secondary" size="xs">
                        Bulanan
                      </Pill>
                      <span className="text-body-xs text-gray-400">
                        Peringkat Bulan Ini
                      </span>
                    </div>
                    <span className="text-label-md font-bold text-gray-100">
                      {userRankBadge}
                    </span>
                  </div>

                  {/* All-time */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5">
                      <Pill variant="secondary" size="xs">
                        All-time
                      </Pill>
                      <span className="text-body-xs text-gray-400">
                        Peringkat Sepanjang Masa
                      </span>
                    </div>
                    <span className="text-label-md font-bold text-gray-100">
                      {userRankBadge}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. DESKTOP (lg+): HORIZONTAL BAR */}
              <div className="hidden lg:flex w-full min-h-16 rounded-lg bg-surface-secondary-default border border-deep-blue-700 px-5 py-3 items-center justify-between gap-4 select-none">
                {/* Left Side: Stats with | Dividers & Username */}
                <div className="flex items-center gap-6">
                  {/* Mingguan */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Pill variant="secondary" size="xs">
                      Mingguan
                    </Pill>
                    <span className="text-label-md font-semibold text-gray-400">
                      {userRankBadge}
                    </span>
                  </div>

                  {/* Divider 1 */}
                  <div className="w-px h-5.5 bg-white/10 shrink-0" />

                  {/* Bulanan */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Pill variant="secondary" size="xs">
                      Bulanan
                    </Pill>
                    <span className="text-label-md font-semibold text-gray-400">
                      {userRankBadge}
                    </span>
                  </div>

                  {/* Divider 2 */}
                  <div className="w-px h-5.5 bg-white/10 shrink-0" />

                  {/* All-time */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Pill variant="secondary" size="xs">
                      All-time
                    </Pill>
                    <span className="text-label-md font-semibold text-gray-400">
                      {userRankBadge}
                    </span>
                  </div>

                  {/* Divider 3 */}
                  <div className="w-px h-5.5 bg-white/10 shrink-0" />

                  {/* Username */}
                  <span className="text-body-md font-semibold text-gray-50 truncate shrink-0">
                    {currentUser?.name || "Tamu Gamezygo"}
                  </span>
                </div>

                {/* Right Side: Points Badge */}
                <div className="px-4 py-1.5 rounded-lg border border-gradient-secondary text-label-sm font-semibold text-gray-50 shrink-0">
                  {userPointsBadge}
                </div>
              </div>

              {/* Bottom Actions Row (Caption & Tombol) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full pt-1">
                <p className="text-body-xs sm:text-body-sm text-gray-400">
                  Raih 100 points dan dapatkan Voucher diskon!
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={useAuthStore.getState().role === "guest" ? () => router.push("/login") : () => router.push("/bundle") }
                    className="w-full sm:w-auto px-6 py-2 cursor-pointer h-11 justify-center"
                  >
                    Klaim Hadiah
                  </Button>
                </div>
              </div>
            </section>

          {/* ========================================================
              3. WEEKLY & MONTHLY 2-COLUMN GRID (Menggunakan UserRank)
             ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* WEEKLY */}
            <section className="rounded-lg bg-deep-blue-900 border border-gradient-secondary p-6 sm:p-7 flex flex-col shadow-xl">
              <h3 className="text-h6 sm:text-h6 font-semibold text-gray-50 uppercase mb-10">
                WEEKLY
              </h3>
              <div className="flex flex-col gap-2">
                {weeklyList.map((item, idx) => (
                  <UserRank
                    key={`weekly-${idx}-${item.name}`}
                    rank={item.rank}
                    name={item.name}
                    points={item.points}
                    className={getUserRankClass(idx)}
                  />
                ))}
              </div>
            </section>

            {/* MONTHLY */}
            <section className="rounded-lg bg-deep-blue-900 border border-gradient-secondary p-6 sm:p-7 flex flex-col shadow-xl">
              <h3 className="text-h6 sm:text-h6 font-semibold text-gray-50 uppercase mb-10">
                MONTHLY
              </h3>
              <div className="flex flex-col gap-2">
                {monthlyList.map((item, idx) => (
                  <UserRank
                    key={`monthly-${idx}-${item.name}`}
                    rank={item.rank}
                    name={item.name}
                    points={item.points}
                    className={getUserRankClass(idx)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* ========================================================
              4. LIFETIME CARD (Menggunakan UserRank)
             ======================================================== */}
          <section className="rounded-lg bg-deep-blue-900 border border-gradient-secondary p-6 sm:p-7 flex flex-col shadow-xl w-full">
            <h3 className="text-h6 sm:text-h6 font-semibold text-gray-50 uppercase mb-10">
              LIFETIME
            </h3>
            <div className="flex flex-col gap-2">
              {lifetimeList.map((item, idx) => (
                <UserRank
                  key={`lifetime-${idx}-${item.name}`}
                  rank={item.rank}
                  name={item.name}
                  points={item.points}
                  className={getUserRankClass(idx)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

        {/* TOAST FEEDBACK */}
        {toastMessage && (
          <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 md:w-auto md:min-w-80 md:max-w-105 animate-fade-in">
            <Toast
              variant="success"
              title="Notifikasi"
              description={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}
      </StoreLayout>
    </>
  );
}
