import * as React from "react";
import Head from "next/head";
import { StoreLayout } from "@/components/layout";
import { Header, Button, UserRank, Toast, Pill } from "@/components/ui";
import { useLeaderboard, useUserLeaderboardRank } from "@/hooks/use-leaderboard";

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
      ? `${userRankApiRes.data.point} pts`
      : "67 pts";

  const currentUser = {
    name: "Cihuy6767",
    email: "cihuy@gamezygo.com",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
  };

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
        navbarVariant="login"
        hideSidebar={true}
        activeNavId="leaderboard"
        user={currentUser}
        onCartClick={() => handleToast("Membuka keranjang belanja")}
      >
        <div className="flex flex-col w-full  mx-auto select-none pt-4 pb-16">
          {/* ========================================================
              1. HERO SECTION (Menggunakan komponen Header yang sudah ada)
             ======================================================== */}
          <div className="flex justify-center w-full py-10xl ">
            <Header
              pillText="Promo Musim Panas Telah Datang!"
              title="Pemilik Koleksi Game Terbesar Saat Ini!"
              subtitle="Ingin Langsung Buka Semua? Beli Premium"
              actionLabel="Lihat Premium"
              actionVariant="secondary"
              onActionClick={() => handleToast("Membuka paket berlangganan...")}
              className=""
            />
          </div>
<div className="grid gap-6">
          {/* ========================================================
              2. PERINGKAT ANDA CARD (Pembungkus dengan background deep-blue-900)
             ======================================================== */}
          <section className="w-full rounded-lg bg-deep-blue-900 border border-gradient-secondary p-6 sm:p-7 flex flex-col gap-6 shadow-xl">
            {/* Header: Icon + Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-secondary-default border border-deep-blue-700 flex items-center justify-center text-gray-300  shrink-0">
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

            {/* User Statistics Row */}
            <div className="w-full min-h-16 rounded-lg bg-surface-secondary-default border border-deep-blue-700 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
              {/* Left Side: Stats with | Dividers & Username */}
              <div className="flex items-center gap-6 overflow-x-auto no-scrollbar w-full sm:w-auto">
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
                  {currentUser.name}
                </span>
              </div>

              {/* Right Side: Points Badge */}
              <div className="px-4 py-1.5 rounded-lg border border-gradient-secondary text-label-sm font-semibold text-gray-50 shrink-0 self-end sm:self-auto">
                {userPointsBadge}
              </div>
            </div>

            {/* Bottom Actions Row (Caption & Tombol) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full pt-1">
              <p className="text-body-xs sm:text-body-sm text-gray-400">
                Raih 100 points dan dapatkan Voucher diskon!
              </p>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => handleToast("Voucher berhasil diklaim!")}
                  className="px-6 py-2 cursor-pointer"
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
          <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
            <Toast variant="success" title="Notifikasi" description={toastMessage} />
          </div>
        )}
      </StoreLayout>
    </>
  );
}
