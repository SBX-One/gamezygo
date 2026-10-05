import * as React from "react";
import Head from "next/head";
import { StoreLayout } from "@/components/layout";
import {
  Button,
  Pill,
  StatCard,
  InputField,
  Toast,
} from "@/components/ui";
import { useUserProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useAuthStore } from "@/stores/use-auth-store";
import { MOCK_USER } from "@/lib/mock/data";

interface TransactionGame {
  id: string;
  title: string;
  imageSrc: string;
  points: string;
  price: string;
}

const RECENT_TRANSACTIONS: TransactionGame[] = [
  {
    id: "gta-1",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    points: "+27 pts",
    price: "Rp 219.500",
  },
  {
    id: "gta-2",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    points: "+27 pts",
    price: "Rp 219.500",
  },
  {
    id: "gta-3",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    points: "+27 pts",
    price: "Rp 219.500",
  },
  {
    id: "rdr2-1",
    title: "Red Dead Redemption 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    points: "+35 pts",
    price: "Rp 219.000",
  },
  {
    id: "cyberpunk-1",
    title: "Cyberpunk 2077",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg",
    points: "+45 pts",
    price: "Rp 350.000",
  },
  {
    id: "elden-1",
    title: "Elden Ring",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900_2x.jpg",
    points: "+40 pts",
    price: "Rp 399.000",
  },
  {
    id: "gow-1",
    title: "God of War",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/library_600x900_2x.jpg",
    points: "+50 pts",
    price: "Rp 529.000",
  },
];

/**
 * Komponen Item Transaksi Game dengan konsep yang sama seperti RequestListItem:
 * - Cover game poster vertikal di sebelah kiri (dengan aspect ratio poster & stretched/rounded)
 * - Judul game tebal warna putih bersih ukuran besar (text-xl / text-[22px]) di atas
 * - Pill badge (+27 pts) merah cerah dan harga putih tebal (Rp 219.500) di baris bawah
 */
interface TransactionCardProps {
  item: TransactionGame;
  onClick?: () => void;
}

function TransactionCard({ item, onClick }: TransactionCardProps) {
  const isDragTriggered = React.useRef(false);

  return (
    <div
      onMouseDown={() => {
        isDragTriggered.current = false;
      }}
      onMouseMove={() => {
        isDragTriggered.current = true;
      }}
      onClick={() => {
        if (!isDragTriggered.current) {
          onClick?.();
        }
      }}
      className="w-86 h-22 shrink-0 flex items-center gap-4 p-2 rounded-lg bg-surface-secondary-default border border-white/5 hover:border-gradient-secondary transition-all duration-150 select-none cursor-pointer group"
    >
      {/* 1. Game Cover Image (Figma: H 72px, rounded-md) */}
      <div className="w-16 h-full rounded-md overflow-hidden bg-deep-blue-950 shrink-0 relative border border-white/5">
        <img
          src={item.imageSrc}
          alt={item.title}
          draggable={false}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 pointer-events-none select-none rounded-md"
          loading="lazy"
        />
      </div>

      {/* 2. Text Details & Bottom Row (Figma: W Fill, H Hug, Gap 12, py 1) */}
      <div className="flex flex-col justify-between flex-1 min-w-0 h-18 py-0.5 gap-3">
        {/* Judul Game */}
        <h3 className="font-bold text-white text-body-md   group-hover:text-rose-200 transition-colors">
          {item.title}
        </h3>

        {/* Baris Bawah: Pill Poin di kiri, Harga di kanan */}
        <div className="flex items-center justify-between w-full mt-auto">
          {/* Badge Poin Merah */}
          <Pill variant="primary" size="xs">
            {item.points}
          </Pill>

          {/* Harga Game Putih Tebal */}
          <span className="text-body-sm font-semibold text-gray-50 whitespace-nowrap">
            {item.price}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Container Carousel Horizontal yang Swipeable (mendukung drag mouse & swipe touch):
 * Menggunakan konsep track horizontal dengan mouse drag event & tombol navigasi desktop
 */
interface SwipeableTrackProps {
  children: React.ReactNode;
  itemCount?: number;
}

function SwipeableTrack({ children, itemCount = 0 }: SwipeableTrackProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDown = React.useRef(false);
  const startX = React.useRef(0);
  const scrollLeft = React.useRef(0);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const checkScroll = React.useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft: sLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollRight(sLeft < scrollWidth - clientWidth - 10);
  }, []);

  React.useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    containerRef.current.classList.remove("scroll-smooth");
  };

  const handleMouseLeave = () => {
    if (isDown.current && containerRef.current) {
      containerRef.current.classList.add("scroll-smooth");
    }
    isDown.current = false;
  };

  const handleMouseUp = () => {
    if (isDown.current && containerRef.current) {
      containerRef.current.classList.add("scroll-smooth");
    }
    isDown.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
    checkScroll();
  };

  const showShadow = itemCount > 3 && canScrollRight;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Swipeable Track */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-4 py-2 px-1 cursor-grab active:cursor-grabbing select-none"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {children}
      </div>

      {/* Right fade shadow indicator jika items > 3 */}
      {showShadow && (
        <div className="pointer-events-none absolute right-0 inset-y-0 w-28 sm:w-36 bg-linear-to-l from-deep-blue-950 via-deep-blue-950/80 to-transparent rounded-r-lg z-10 transition-opacity duration-300" />
      )}
    </div>
  );
}

export default function ProfilePage() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Global Auth Store Integration
  const authUser = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  // User Profile State
  const [user, setUser] = React.useState({
    name: authUser?.name || MOCK_USER.name,
    email: authUser?.email || MOCK_USER.email,
    joinedDate: authUser?.joinedDate || MOCK_USER.joinedDate || "22/06/2026",
    avatarUrl: authUser?.avatarUrl || MOCK_USER.avatarUrl,
  });

  // TanStack Query: User Profile API
  const { data: profileApiRes } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();

  // Modal Ubah Profil
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editName, setEditName] = React.useState(user.name);
  const [editAvatarUrl, setEditAvatarUrl] = React.useState(user.avatarUrl);

  React.useEffect(() => {
    if (profileApiRes?.data) {
      const updated = {
        name: profileApiRes.data.name || user.name,
        email: profileApiRes.data.email || user.email,
        avatarUrl: profileApiRes.data.avatar_url || user.avatarUrl,
        joinedDate: profileApiRes.data.joined_date || user.joinedDate,
      };
      setUser((prev) => ({
        ...prev,
        ...updated,
      }));
      updateUser(updated);
      setEditName(profileApiRes.data.name || "");
      setEditAvatarUrl(profileApiRes.data.avatar_url || "");
    }
  }, [profileApiRes]);

  // State Reward Voucher (false = variant belum bisa dapatkan reward [Gambar 2], true = sudah ada reward)
  const [hasReward] = React.useState(false);
  const [rewardVoucherCode] = React.useState("H3718H-67");

  // Accordion Expand/Collapse States
  const [isPhoneOpen, setIsPhoneOpen] = React.useState(true);
  const [phoneNumber, setPhoneNumber] = React.useState("+62123456789");
  const phoneInputRef = React.useRef<HTMLInputElement>(null);
  const [isRecentTransOpen, setIsRecentTransOpen] = React.useState(true);
  const [isPasswordOpen, setIsPasswordOpen] = React.useState(true);

  // Password Input Fields State
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      handleToast(`Kode "${text}" berhasil disalin ke clipboard!`);
    } else {
      handleToast(`Kode "${text}" berhasil disalin!`);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      handleToast("Mohon lengkapi semua kolom password!");
      return;
    }
    if (newPassword !== confirmPassword) {
      handleToast("Password baru dan konfirmasi tidak cocok!");
      return;
    }
    handleToast("Password Anda berhasil diperbarui!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = editName.trim();
    if (!trimmedName) {
      handleToast("Nama tidak boleh kosong!");
      return;
    }
    const trimmedAvatar = editAvatarUrl?.trim() || "";
    updateProfileMutation.mutate({
      name: trimmedName,
      avatar_url: trimmedAvatar || undefined,
    });
    setUser((prev) => ({
      ...prev,
      name: trimmedName,
      avatarUrl: trimmedAvatar || prev.avatarUrl,
    }));
    updateUser({
      name: trimmedName,
      avatarUrl: trimmedAvatar || user.avatarUrl,
    });
    setIsEditModalOpen(false);
    handleToast("Profil berhasil diperbarui!");
  };

  return (
    <>
      <Head>
        <title>Profil Saya - Gamezygo</title>
        <meta
          name="description"
          content="Informasi akun, statistik transaksi, poin, peringkat, dan pengaturan keamanan Gamezygo Anda."
        />
      </Head>

      <StoreLayout
        hideNavbar={true}
        hideSidebar={true}
        contentClassName="sm:px-20 sm:py-10"
        activeNavId=""
        user={user}
      >
        {/* ========================================================
            1. PAGE TITLE & FULL-WIDTH DIVIDER (Full Screen Width)
           ======================================================== */}
        <div className="w-full  border-b-gradient-secondary pt-6 pb-4 mb-8xl">
          <div className="w-full mx-auto px-4 sm:px-0">
            <h1 className="text-body-lg sm:text-h6 font-bold text-white ">
              Profile
            </h1>
          </div>
        </div>

        {/* ========================================================
            2. RED COVER BANNER (Full Screen Width)
           ======================================================== */}
        <div className="w-full rounded-lg h-48 sm:h-80 mt-4 sm:mt-6 bg-linear-to-r from-[#BF3E42] via-[#99282C] to-[#5C1417] relative overflow-hidden" />

        {/* ========================================================
            3. MAIN CONTENT CONTAINER (PROFILE CARD + STATS + SECTIONS)
           ======================================================== */}
        <div className="w-full max-w-243.5 mx-auto select-none pb-20 px-4 sm:px-0 flex flex-col gap-5">
          {/* Profile Info Card (Overlapping -mt-14 sm:-mt-16, w-full with NO mx-3/mx-6 so it is 100% sejajar with 3 cards) */}
          <div className="relative -mt-14 sm:-mt-16 w-full rounded-lg bg-deep-blue-900 border border-white/5 p-5 sm:p-6 flex flex-col sm:flex-row  justify-between gap-4">
            {/* Left Side: Avatar + Details */}
            <div className="flex  gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-gradient-secondary shrink-0 bg-deep-blue-800">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <h2 className="text-body-lg sm:text-h6 font-semibold text-white ">
                  {user.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-label-xs">
                  <Button variant="outline" size='sm' >
                    {user.email}
                  </Button>
                  <span className="bg-border-secondary-default w-px h-full"></span>
                  <span className="text-gray-400 text-body-xs">
                    Bergabung sejak: {user.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Ubah Profile Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditName(user.name);
                setEditAvatarUrl(user.avatarUrl);
                setIsEditModalOpen(true);
              }}
            >
              <img
                src="/assets/svg/fluent_edit-24-regular.svg"
                alt="Edit"
                className="w-4 h-4 filter-[brightness(0)_invert(0.8)]"
              />
              <span>Ubah Profile</span>
            </Button>
          </div>

          {/* ========================================================
              3. STAT CARDS ROW (Total Transactions, Points, Games)
             ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
            {/* Card 1: Total Transactions (Gambar 2: Cart icon) */}
            <StatCard
              icon={
                <img
                  src="/assets/svg/fluent_cart-24-regular.svg"
                  alt="Transactions"
                  className="w-5 h-5 filter-[brightness(0)_invert(0.8)]"
                />
              }
              label="Total Transactions"
              value={
                <span className="text-white text-h4 font-semibold inline-flex items-baseline gap-1.5">
                  67{" "}
                    transactions
                </span>
              }
              className="bg-deep-blue-900 border border-white/5 rounded-lg p-6 "
            />

            {/* Card 2: Total Points (Gambar 2: Ticket diagonal icon) */}
            <StatCard
              icon={
                <img
                  src="/assets/svg/fluent_ticket-diagonal-24-filled.svg"
                  alt="Points"
                  className="w-5 h-5 filter-[brightness(0)_invert(0.8)]"
                />
              }
              label="Total Points"
              value={
                <span className="text-white text-h4 font-semibold inline-flex items-baseline gap-1.5">
                  677{" "}
                    pts
                </span>
              }
              className="bg-deep-blue-900 border border-white/5 rounded-lg p-6 "
            />

            {/* Card 3: Total Games (Gambar 2: Variant belum bisa dapatkan reward) */}
            <StatCard
              icon={
                <img
                  src="/assets/svg/fluent_games-24-filled.svg"
                  alt="Games"
                  className="w-5 h-5 filter-[brightness(0)_invert(0.8)]"
                />
              }
              label="Total Games"
              value={
                !hasReward ? (
                  /* Variant: Belum bisa mendapatkan reward (Sesuai Gambar 2) */
                  <div className="flex items-center justify-between w-full">
                    <p className="text-body-xs text-gray-400">
                      Raih 100 poin dan
                      <br />
                      dapatkan voucher diskon!
                    </p>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-body-md font-semibold text-gray-400">
                        -
                      </span>
                      <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={() =>
                          handleToast(
                            "Kumpulkan minimal 100 poin untuk membuka kode voucher diskon!"
                          )
                        }
                        className="w-8 h-8 p-0! rounded-lg flex items-center justify-center shrink-0 border border-deep-blue-700 cursor-pointer"
                        title="Voucher belum tersedia (butuh 100 poin)"
                        aria-label="Voucher belum tersedia"
                      >
                        <img
                          src="/assets/svg/fluent_copy-24-regular.svg"
                          alt="Copy"
                          className="w-4.5 h-4.5 filter-[brightness(0)_invert(0.8)]"
                        />
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Variant: Sudah bisa mendapatkan reward */
                  <div className="flex items-center justify-between w-full">
                    <span className="text-white text-h5 font-bold ">
                      {rewardVoucherCode}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={() => handleCopy(rewardVoucherCode)}
                      className="w-8 h-8 p-0! rounded-lg flex items-center justify-center shrink-0 border border-deep-blue-700 cursor-pointer"
                      title="Salin ID Games"
                      aria-label="Salin ID Games"
                    >
                      <img
                        src="/assets/svg/fluent_copy-24-regular.svg"
                        alt="Copy"
                        className="w-4.5 h-4.5 filter-[brightness(0)_invert(0.8)]"
                      />
                    </Button>
                  </div>
                )
              }
              className="bg-deep-blue-900 border border-white/5 rounded-lg p-6 "
            />
          </div>

          {/* ========================================================
              4. RANGKING SAAT INI CARD
             ======================================================== */}
          <section className="w-full rounded-lg bg-deep-blue-900 border border-white/5 p-6 flex flex-col gap-8 ">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-surface-secondary-default border border-deep-blue-700 flex items-center justify-center text-gray-300  shrink-0">
              <img
                  src="/assets/svg/material-symbols_leaderboard-outline-rounded.svg"
                  alt="Rank"
                  className="w-full h-full filter-[brightness(0)_invert(0.8)]"
                />
        </div>   
              <h3 className="text-body-lg  font-semibold text-white ">
                Rangking Saat Ini
              </h3>
            </div>

            {/* Ranking Items with Subtle Horizontal Dividers */}
            <div className="flex flex-col gap-5">
              {/* Row 1: Mingguan */}
              <div className="flex items-center justify-between ">
                <Pill variant="secondary" size="xs" className="px-2">
                  Mingguan
                </Pill>
                <span className="text-label-md font-semibold text-white">#67</span>
              </div>
              <div className="w-full h-px bg-border-secondary-default " />

              {/* Row 2: Bulanan */}
              <div className="flex items-center justify-between ">
                <Pill variant="secondary" size="xs" className="px-2">
                  Bulanan
                </Pill>
                <span className="text-label-md font-semibold text-white">#67</span>
              </div>
              <div className="w-full h-px bg-border-secondary-default" />

              {/* Row 3: All-time */}
              <div className="flex items-center justify-between ">
                <Pill variant="secondary" size="xs" className="px-2">
                  All-time
                </Pill>
                <span className="text-label-md font-semibold text-white">#67</span>
              </div>
            </div>
          </section>

          {/* ========================================================
              5. NOMOR TELEPON (ACCORDION)
             ======================================================== */}
          <div className="w-full rounded-lg bg-transparent border border-white/5 p-6 flex flex-col">
            {/* Header Trigger */}
            <button
              type="button"
              onClick={() => setIsPhoneOpen(!isPhoneOpen)}
              className="w-full flex items-center justify-between text-left cursor-pointer outline-none select-none"
              aria-expanded={isPhoneOpen}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-secondary-default border border-deep-blue-700 flex items-center justify-center text-gray-300 shrink-0">
                  <img
                    src="/assets/svg/mynaui_telephone.svg"
                    alt="Nomor Telepon"
                    className="w-4.5 h-4.5 filter-[brightness(0)_invert(0.8)]"
                  />
                </div>
                <h3 className="text-body-lg sm:text-h6 font-bold text-white">
                  Nomor Telepon
                </h3>
              </div>
              <span className="text-gray-400 p-1 rounded hover:bg-white/5 transition-colors">
                {isPhoneOpen ? (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                )}
              </span>
            </button>

            {/* Expandable Phone Content */}
            {isPhoneOpen && (
              <div className="pt-6 w-full">
                <InputField
                  placeholder="Nomor Telepon"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      phoneInputRef.current?.blur();
                      handleToast("Nomor telepon berhasil disimpan!");
                    }
                  }}
                  size="md"
                  inputRef={phoneInputRef}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => {
                        phoneInputRef.current?.focus();
                        handleToast("Silakan ubah nomor telepon Anda");
                      }}
                      className="text-gray-400 hover:text-white cursor-pointer outline-none transition-colors"
                      aria-label="Ubah Nomor Telepon"
                    >
                      <img
                        src="/assets/svg/fluent_edit-24-regular.svg"
                        alt="Ubah Nomor Telepon"
                        className="w-4.5 h-4.5 filter-[brightness(0)_invert(0.8)]"
                      />
                    </button>
                  }
                />
              </div>
            )}
          </div>
          {/* ========================================================
              6. TRANSAKSI TERAKHIR (SWIPEABLE ACCORDION)
             ======================================================== */}
          <div className="w-full rounded-lg bg-transparent border border-white/5 p-6 flex flex-col ">
            {/* Header Trigger */}
            <button
              type="button"
              onClick={() => setIsRecentTransOpen(!isRecentTransOpen)}
              className="w-full flex items-center justify-between text-left cursor-pointer outline-none select-none"
              aria-expanded={isRecentTransOpen}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-secondary-default border border-deep-blue-700 flex items-center justify-center text-gray-300  shrink-0">
                  <img
                    src="/assets/svg/fluent_cart-24-regular.svg"
                    alt="Transaksi"
                    className="w-4.5 h-4.5 filter-[brightness(0)_invert(0.8)]"
                  />
                </div>
                <h3 className="text-body-lg sm:text-h6 font-bold text-white ">
                  Transaksi Terakhir
                </h3>
              </div>
              <span className="text-gray-400 p-1 rounded hover:bg-white/5 transition-colors">
                {isRecentTransOpen ? (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                )}
              </span>
            </button>

            {/* Expandable Swipeable Game Track */}
            {isRecentTransOpen && (
              <div className="w-full pt-6">
                <SwipeableTrack itemCount={RECENT_TRANSACTIONS.length}>
                  {RECENT_TRANSACTIONS.map((game) => (
                    <TransactionCard
                      key={game.id}
                      item={game}
                      onClick={() => handleToast(`Melihat detail ${game.title}`)}
                    />
                  ))}
                </SwipeableTrack>
              </div>
            )}
          </div>

          {/* ========================================================
              7. PASSWORD CHANGE FORM (ACCORDION ITEM 3)
             ======================================================== */}
          <div className="w-full rounded-lg bg-transparent border border-white/5 p-6 flex flex-col ">
            {/* Header Trigger */}
            <button
              type="button"
              onClick={() => setIsPasswordOpen(!isPasswordOpen)}
              className="w-full flex items-center justify-between text-left cursor-pointer outline-none select-none"
              aria-expanded={isPasswordOpen}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-secondary-default border border-deep-blue-700 flex items-center justify-center text-gray-300  shrink-0">
                  <img
                    src="/assets/svg/fluent_key-multiple-24-filled.svg"
                    alt="Password"
                    className="w-4.5 h-4.5 filter-[brightness(0)_invert(0.8)]"
                  />
                </div>
                <h3 className="text-body-lg sm:text-h6 font-bold text-white ">
                  Password Change
                </h3>
              </div>
              <span className="text-gray-400 p-1 rounded hover:bg-white/5 transition-colors">
                {isPasswordOpen ? (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                )}
              </span>
            </button>

            {/* Expandable Password Form */}
            {isPasswordOpen && (
              <form
                onSubmit={handlePasswordChange}
                className="flex flex-col gap-5 w-full pt-6"
              >
                {/* Password Lama */}
                <InputField
                  label="Password Lama"
                  placeholder="Password"
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  size="sm"
                  forceState="unfilled"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="text-gray-400 hover:text-white cursor-pointer outline-none"
                      aria-label="Toggle visibility"
                    >
                      <img
                        src={
                          showOldPassword
                            ? "/assets/svg/fluent_eye-off-24-regular.svg"
                            : "/assets/svg/fluent_eye-24-regular.svg"
                        }
                        alt="Toggle visibility"
                        className="w-4 h-4 filter-[brightness(0)_invert(0.7)]"
                      />
                    </button>
                  }
                />

                {/* Password Baru */}
                <InputField
                  label="Password Baru"
                  placeholder="Password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  size="sm"
                  forceState="unfilled"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-gray-400 hover:text-white cursor-pointer outline-none"
                      aria-label="Toggle visibility"
                    >
                      <img
                        src={
                          showNewPassword
                            ? "/assets/svg/fluent_eye-off-24-regular.svg"
                            : "/assets/svg/fluent_eye-24-regular.svg"
                        }
                        alt="Toggle visibility"
                        className="w-4 h-4 filter-[brightness(0)_invert(0.7)]"
                      />
                    </button>
                  }
                />

                {/* Konfirmasi Password */}
                <InputField
                  label="Konfirmasi Password"
                  placeholder="Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  size="sm"
                  forceState="unfilled"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-400 hover:text-white cursor-pointer outline-none"
                      aria-label="Toggle visibility"
                    >
                      <img
                        src={
                          showConfirmPassword
                            ? "/assets/svg/fluent_eye-off-24-regular.svg"
                            : "/assets/svg/fluent_eye-24-regular.svg"
                        }
                        alt="Toggle visibility"
                        className="w-4 h-4 filter-[brightness(0)_invert(0.7)]"
                      />
                    </button>
                  }
                />

                {/* Action Submit */}
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="px-8 py-2.5 font-semibold text-label-sm cursor-pointer"
                  >
                    Perbarui
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ========================================================
            MODAL UBAH PROFIL
           ======================================================== */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
              onClick={() => setIsEditModalOpen(false)}
            />

            {/* Modal Box */}
            <div className="relative z-10 w-full  rounded-lg bg-deep-blue-900  p-6 flex flex-col gap-6  animate-scale-up sm:max-w-[45%]">
              <div className="flex items-center justify-between border-b-gradient-secondary pb-4">
                <h3 className="text-body-lg font-bold text-white ">
                  Ubah Informasi Profil
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer outline-none"
                  aria-label="Tutup modal"
                >
                  <img
                    src="/assets/svg/fluent_dismiss-24-regular.svg"
                    alt="Close"
                    className="w-5 h-5 filter-[brightness(0)_invert(0.8)]"
                  />
                </button>
              </div>

              <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
                <InputField
                  label="Nama Pengguna"
                  placeholder="Masukkan nama tampilan"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  size="md"
                  containerClassName="bg-deep-blue-900/60  "
                />

                <InputField
                  label="URL Foto Avatar"
                  placeholder="https://images.unsplash.com/..."
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  size="md"
                  containerClassName="bg-deep-blue-900/60"
                />

                <div className="flex items-center justify-end gap-3 pt-4 ">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

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
