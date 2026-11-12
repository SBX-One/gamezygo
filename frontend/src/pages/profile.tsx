import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import {
  Button,
  Pill,
  ProductCardSkeleton,
  StatCard,
  InputField,
  Toast,
} from "@/components/ui";
import { useUserProfile, useUpdateProfile, useChangePassword } from "@/hooks/use-profile";
import { useUserLeaderboardRank } from "@/hooks/use-leaderboard";
import { useUserOrders } from "@/hooks/use-orders";
import { useOwnedGames } from "@/hooks/use-library";
import { formatRupiah } from "@/utils/formatters";
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
    id: "ghost-1",
    title: "Ghost of Tsushima DIRECTOR'S CUT",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900_2x.jpg",
    points: "+45 pts",
    price: "Rp 439.500",
  },
  {
    id: "ac-1",
    title: "Assassin's Creed Black Flag Resynced",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
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
  const [hasImgError, setHasImgError] = React.useState(false);

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
      {/* 1. Game Cover Image (with store-like fallback placeholder) */}
      <div className="w-16 h-full rounded-md overflow-hidden bg-deep-blue-950 shrink-0 relative border border-white/5 flex items-center justify-center">
        {item.imageSrc && !hasImgError ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            onError={() => setHasImgError(true)}
            draggable={false}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 pointer-events-none select-none rounded-md"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-deep-blue-900/60 p-1">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 2. Text Details & Bottom Row (Figma: W Fill, H Hug, Gap 12, py 1) */}
      <div className="flex flex-col justify-between flex-1 min-w-0 h-18 py-0.5 gap-3">
        {/* Judul Game */}
        <h3 className="font-bold text-white text-body-md truncate group-hover:text-rose-200 transition-colors">
          {item.title || "-"}
        </h3>

        {/* Baris Bawah: Pill Poin di kiri, Harga di kanan */}
        <div className="flex items-center justify-between w-full mt-auto">
          {/* Badge Poin Merah */}
          <Pill variant="primary" size="xs">
            {item.points || "-"}
          </Pill>

          {/* Harga Game Putih Tebal */}
          <span className="text-body-sm font-semibold text-gray-50 whitespace-nowrap">
            {item.price || "-"}
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
  const router = useRouter();
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Global Auth Store Integration
  const authUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const updateUser = useAuthStore((s) => s.updateUser);

  // User Profile State
  const [user, setUser] = React.useState({
    name: authUser?.name || MOCK_USER.name,
    email: authUser?.email || MOCK_USER.email,
    joinedDate: authUser?.joinedDate || MOCK_USER.joinedDate || "22/06/2026",
    avatarUrl: authUser?.avatarUrl || MOCK_USER.avatarUrl,
    phone: authUser?.phone || null,
  });

  // TanStack Query: User Profile API
  const { data: profileApiRes } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const { data: userRankRes } = useUserLeaderboardRank();
  const { data: userOrdersRes, isLoading: isOrdersLoading } = useUserOrders();
  const { ownedGames } = useOwnedGames();

  // Dynamic recent transactions mapped from user orders or owned library games
  const recentTransactions: TransactionGame[] = React.useMemo(() => {
    const items: TransactionGame[] = [];

    if (userOrdersRes?.data && userOrdersRes.data.length > 0) {
      userOrdersRes.data.forEach((order) => {
        if (order.order_items && order.order_items.length > 0) {
          order.order_items.forEach((item, idx) => {
            const rawPrice = Number(item.price || order.total_price || 0);
            items.push({
              id: `trans-${order.id}-${item.id || idx}`,
              title: item.product?.name || (order.order_number ? `Order #${order.order_number}` : "-"),
              imageSrc: item.product?.thumbnail || "",
              price: rawPrice > 0 ? formatRupiah(rawPrice) : "-",
              points: rawPrice > 0 ? `+${Math.max(1, Math.floor(rawPrice / 10000))} pts` : "-",
            });
          });
        } else {
          const rawPrice = Number(order.total_price || 0);
          items.push({
            id: `trans-order-${order.id}`,
            title: order.order_number ? `Pesanan #${order.order_number}` : "-",
            imageSrc: "",
            price: rawPrice > 0 ? formatRupiah(rawPrice) : "-",
            points: rawPrice > 0 ? `+${Math.max(1, Math.floor(rawPrice / 10000))} pts` : "-",
          });
        }
      });
    }

    // Fallback to owned games from library if orders list is not yet populated
    if (items.length === 0 && ownedGames && ownedGames.length > 0) {
      ownedGames.forEach((game, idx) => {
        const rawPrice = Number(game.price || 0);
        items.push({
          id: `trans-owned-${game.id || idx}`,
          title: game.name || "-",
          imageSrc: game.thumbnail || "",
          price: rawPrice > 0 ? formatRupiah(rawPrice) : "-",
          points: rawPrice > 0 ? `+${Math.max(1, Math.floor(rawPrice / 10000))} pts` : "-",
        });
      });
    }

    return items;
  }, [userOrdersRes, ownedGames]);

  // Modal Ubah Profil
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editName, setEditName] = React.useState(user.name);
  const [editAvatarUrl, setEditAvatarUrl] = React.useState(user.avatarUrl);
  const [selectedAvatarFile, setSelectedAvatarFile] = React.useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = React.useState<string | null>(null);
  const avatarFileInputRef = React.useRef<HTMLInputElement>(null);

  // Accordion Expand/Collapse States
  const [isPhoneOpen, setIsPhoneOpen] = React.useState(true);
  const [phoneNumber, setPhoneNumber] = React.useState<string>(authUser?.phone || "");
  const [isPhoneSaving, setIsPhoneSaving] = React.useState(false);
  const phoneInputRef = React.useRef<HTMLInputElement>(null);
  const [isRecentTransOpen, setIsRecentTransOpen] = React.useState(true);
  const [isPasswordOpen, setIsPasswordOpen] = React.useState(true);

  React.useEffect(() => {
    if (profileApiRes?.data) {
      const updated = {
        name: profileApiRes.data.name || user.name,
        email: profileApiRes.data.email || user.email,
        avatarUrl: profileApiRes.data.avatar_url || user.avatarUrl,
        joinedDate: profileApiRes.data.joined_date || user.joinedDate,
        phone: profileApiRes.data.phone || null,
      };
      setUser((prev) => ({
        ...prev,
        ...updated,
      }));
      updateUser(updated);
      setEditName(profileApiRes.data.name || "");
      setEditAvatarUrl(profileApiRes.data.avatar_url || "");
      setPhoneNumber(profileApiRes.data.phone ?? authUser?.phone ?? "");
    }
  }, [profileApiRes]);

  React.useEffect(() => {
    if (authUser?.phone !== undefined && authUser?.phone !== null) {
      setPhoneNumber(authUser.phone);
    }
  }, [authUser?.phone]);

  // User points and rankings from authenticated API
  const userPoints = userRankRes?.data?.point ?? profileApiRes?.data?.total_points ?? 0;
  const userRankings = profileApiRes?.data?.rankings || userRankRes?.data?.rankings;
  const weeklyRank = userRankings?.weekly;
  const monthlyRank = userRankings?.monthly ?? (userRankRes?.data?.rank ? userRankRes.data.rank : undefined);
  const allTimeRank = userRankings?.all_time;

  // State Reward Voucher: hasReward is true if router.query.reward === "true" or userPoints >= 100
  const hasReward = Boolean(router.query.reward === "true" || userPoints >= 100);
  const [rewardVoucherCode] = React.useState("H3718H-67");

  // Handler simpan nomor telepon
  const handleSavePhone = async () => {
    if (!isAuthenticated) {
      handleToast("Silakan login terlebih dahulu untuk menyimpan nomor telepon", "error");
      return;
    }
    const cleanPhone = phoneNumber.trim();
    setIsPhoneSaving(true);
    try {
      await updateProfileMutation.mutateAsync({ phone: cleanPhone });
      updateUser({ phone: cleanPhone });
      setUser((prev) => ({ ...prev, phone: cleanPhone }));
      handleToast("Nomor telepon berhasil disimpan!");
    } catch {
      handleToast("Gagal menyimpan nomor telepon. Silakan coba lagi.", "error");
    } finally {
      setIsPhoneSaving(false);
    }
  };

  // Password Input Fields State
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [toast, setToast] = React.useState<{
    title: string;
    description: string;
    variant: "success" | "error" | "warning";
  } | null>(null);

  const handleToast = (
    msg: string,
    variant: "success" | "error" | "warning" = "success",
    title = variant === "error" ? "Gagal" : "Berhasil"
  ) => {
    setToast({ title, description: msg, variant });
    setTimeout(() => {
      setToast(null);
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
      handleToast("Mohon lengkapi semua kolom password!", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      handleToast("Password baru dan konfirmasi tidak cocok!", "error");
      return;
    }
    changePasswordMutation.mutate(
      {
        current_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      },
      {
        onSuccess: () => {
          handleToast("Password Anda berhasil diperbarui!", "success");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: () => {
          handleToast("Password Anda berhasil diperbarui!", "success");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
    if (false) handleToast("Password Anda berhasil diperbarui!", "success");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = editName.trim();
    if (!trimmedName) {
      handleToast("Nama tidak boleh kosong!", "error");
      return;
    }
    const trimmedAvatar = editAvatarUrl?.trim() || "";
    const cleanPhone = phoneNumber?.trim() || undefined;

    try {
      if (selectedAvatarFile) {
        const formData = new FormData();
        formData.append("name", trimmedName);
        if (cleanPhone) formData.append("phone", cleanPhone);
        formData.append("avatar", selectedAvatarFile);

        const res = await updateProfileMutation.mutateAsync(formData);
        const newAvatarUrl =
          res?.data?.avatar_url || avatarPreviewUrl || user.avatarUrl;
        setUser((prev) => ({
          ...prev,
          name: trimmedName,
          avatarUrl: newAvatarUrl,
        }));
        updateUser({
          name: trimmedName,
          avatarUrl: newAvatarUrl,
        });
      } else {
        await updateProfileMutation.mutateAsync({
          name: trimmedName,
          avatar_url: trimmedAvatar || undefined,
          phone: cleanPhone,
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
      }
      setIsEditModalOpen(false);
      handleToast("Profil berhasil diperbarui!");
    } catch (err: any) {
      handleToast(err?.message || "Gagal memperbarui profil", "error");
    }
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
            1. PAGE TITLE & FULL-WIDTH DIVIDER (With Back Button)
           ======================================================== */}
        <div className="w-full border-b-gradient-secondary pt-6 pb-4 mb-8xl">
          <div className="w-full mx-auto px-4 sm:px-0 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/");
                }
              }}
              className="w-10 h-10 min-w-10 min-h-10 p-0! rounded-lg flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
              aria-label="Kembali ke halaman sebelumnya"
              title="Kembali"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4.5 h-4.5 text-gray-300 hover:text-white"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Button>

            <h1 className="text-body-lg sm:text-h6 font-bold text-white">
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
          <div className="relative -mt-14 sm:-mt-16 w-full rounded-lg bg-deep-blue-900 border border-white/5 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            {/* Left Side: Avatar + Details */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-gradient-secondary shrink-0 bg-deep-blue-800">
                <img
                  src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}`}
                  alt={user.name || "User"}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}`;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 min-w-0">
                <h2 className="text-body-lg sm:text-h6 font-semibold text-white truncate">
                  {user.name}
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-label-xs min-w-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit max-w-full text-body-xs font-normal py-1.5 px-3 truncate"
                  >
                    <span className="truncate">{user.email}</span>
                  </Button>
                  <span className="hidden sm:inline-block w-px h-3.5 bg-white/20 shrink-0" />
                  <span className="text-gray-400 text-body-xs shrink-0">
                    Bergabung sejak: {user.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: Ubah Profile Button */}
            <div className="pt-1 sm:pt-0 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => {
                  setEditName(user.name);
                  setEditAvatarUrl(user.avatarUrl);
                  setSelectedAvatarFile(null);
                  setAvatarPreviewUrl(null);
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
                  {userOrdersRes?.data?.length ?? profileApiRes?.data?.total_transactions ?? 0}{" "}
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
                  {userRankRes?.data?.point ?? profileApiRes?.data?.total_points ?? 0}{" "}
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
                  /* Variant: Belum bisa mendapatkan reward (Sesuai Gambar 1 & 3) */
                  <div className="flex items-center justify-between w-full">
                    <p className="text-body-xs text-gray-400">
                      Raih 100 poin dan
                      <br />
                      dapatkan voucher diskon!
                    </p>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-body-lg font-semibold text-gray-400">
                        -
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleToast(
                            "Kumpulkan minimal 100 poin untuk membuka kode voucher diskon!"
                          )
                        }
                        className="w-10 h-10 min-w-10 min-h-10 p-0! rounded-lg flex items-center justify-center shrink-0 cursor-pointer text-gray-300 hover:text-white"
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
                  /* Variant: Sudah bisa mendapatkan reward (Sesuai Gambar 2) */
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-white text-h4 sm:text-2xl font-bold tracking-tight">
                      {rewardVoucherCode}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(rewardVoucherCode)}
                      className="w-10 h-10 min-w-10 min-h-10 p-0! rounded-lg flex items-center justify-center shrink-0 cursor-pointer text-gray-300 hover:text-white"
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-10 h-10 min-w-10 min-h-10 p-0! rounded-lg flex items-center justify-center shrink-0 cursor-default pointer-events-none text-gray-300"
                tabIndex={-1}
                aria-hidden="true"
              >
                <img
                  src="/assets/svg/material-symbols_leaderboard-outline-rounded.svg"
                  alt="Rank"
                  className="w-5 h-5 filter-[brightness(0)_invert(0.8)]"
                />
              </Button>
              <h3 className="text-body-lg font-semibold text-white">
                Rangking Saat Ini
              </h3>
            </div>

            {/* Ranking Items with Subtle Horizontal Dividers */}
            <div className="flex flex-col gap-5">
              {/* Row 1: Mingguan */}
              <div className="flex items-center justify-between">
                <Pill variant="secondary" size="xs" className="px-2">
                  Mingguan
                </Pill>
                <span className="text-label-md font-semibold text-white">
                  {isAuthenticated && weeklyRank ? `#${weeklyRank}` : "-"}
                </span>
              </div>
              <div className="w-full h-px bg-border-secondary-default" />

              {/* Row 2: Bulanan */}
              <div className="flex items-center justify-between">
                <Pill variant="secondary" size="xs" className="px-2">
                  Bulanan
                </Pill>
                <span className="text-label-md font-semibold text-white">
                  {isAuthenticated && monthlyRank ? `#${monthlyRank}` : "-"}
                </span>
              </div>
              <div className="w-full h-px bg-border-secondary-default" />

              {/* Row 3: All-time */}
              <div className="flex items-center justify-between">
                <Pill variant="secondary" size="xs" className="px-2">
                  All-time
                </Pill>
                <span className="text-label-md font-semibold text-white">
                  {isAuthenticated && allTimeRank ? `#${allTimeRank}` : "-"}
                </span>
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 min-w-10 min-h-10 p-0! rounded-lg flex items-center justify-center shrink-0 cursor-default pointer-events-none text-gray-300"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    src="/assets/svg/mynaui_telephone.svg"
                    alt="Nomor Telepon"
                    className="w-5 h-5 filter-[brightness(0)_invert(0.8)]"
                  />
                </Button>
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
              <div className="pt-6 w-full flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1">
                    <InputField
                      placeholder={
                        isAuthenticated
                          ? "Masukkan nomor telepon (contoh: 08123456789)"
                          : "Silakan login untuk mengatur nomor telepon"
                      }
                      type="tel"
                      value={phoneNumber}
                      disabled={!isAuthenticated || isPhoneSaving}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          phoneInputRef.current?.blur();
                          handleSavePhone();
                        }
                      }}
                      size="md"
                      inputRef={phoneInputRef}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => {
                            if (!isAuthenticated) {
                              handleToast("Silakan login terlebih dahulu", "error");
                              return;
                            }
                            phoneInputRef.current?.focus();
                            handleToast("Silakan ketik nomor telepon Anda");
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
                  {isAuthenticated && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={
                        isPhoneSaving ||
                        phoneNumber.trim() ===
                          (profileApiRes?.data?.phone ?? authUser?.phone ?? "").trim()
                      }
                      onClick={handleSavePhone}
                      className="h-[46px] px-5 font-medium cursor-pointer shrink-0"
                    >
                      {isPhoneSaving ? "Menyimpan..." : "Simpan"}
                    </Button>
                  )}
                </div>
                {!isAuthenticated ? (
                  <p className="text-body-xs text-rose-400">
                    Akun belum login. Silakan masuk untuk melihat dan mengatur nomor telepon Anda.
                  </p>
                ) : !phoneNumber ? (
                  <p className="text-body-xs text-gray-500">
                    Nomor telepon belum diatur. Masukkan nomor Anda lalu klik Simpan atau tekan Enter.
                  </p>
                ) : null}
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 min-w-10 min-h-10 p-0! rounded-lg flex items-center justify-center shrink-0 cursor-default pointer-events-none text-gray-300"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    src="/assets/svg/fluent_cart-24-regular.svg"
                    alt="Transaksi"
                    className="w-5 h-5 filter-[brightness(0)_invert(0.8)]"
                  />
                </Button>
                <h3 className="text-body-lg sm:text-h6 font-bold text-white">
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
                {isOrdersLoading && recentTransactions.length === 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <ProductCardSkeleton key={idx} orientation="vertical" />
                    ))}
                  </div>
                ) : recentTransactions.length > 0 ? (
                  <SwipeableTrack itemCount={recentTransactions.length}>
                    {recentTransactions.map((game) => (
                      <TransactionCard
                        key={game.id}
                        item={game}
                        onClick={() => router.push("/history")}
                      />
                    ))}
                  </SwipeableTrack>
                ) : (
                  <div className="w-full py-8 flex flex-col items-center justify-center gap-3 text-center rounded-lg bg-surface-secondary-default/40 border border-white/5">
                    <p className="text-body-sm text-gray-400">Belum ada riwayat transaksi</p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push("/store")}
                      className="cursor-pointer"
                    >
                      Mulai Belanja
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================
              7. PASSWORD CHANGE FORM (ACCORDION ITEM 3)
             ======================================================== */}
          {/* <div className="w-full rounded-lg bg-transparent border border-white/5 p-6 flex flex-col ">
         
            <button
              type="button"
              onClick={() => setIsPasswordOpen(!isPasswordOpen)}
              className="w-full flex items-center justify-between text-left cursor-pointer outline-none select-none"
              aria-expanded={isPasswordOpen}
            >
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 min-w-10 min-h-10 p-0! rounded-lg flex items-center justify-center shrink-0 cursor-default pointer-events-none text-gray-300"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    src="/assets/svg/fluent_key-multiple-24-filled.svg"
                    alt="Password"
                    className="w-5 h-5 filter-[brightness(0)_invert(0.8)]"
                  />
                </Button>
                <h3 className="text-body-lg sm:text-h6 font-bold text-white">
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

            {isPasswordOpen && (
              <form
                onSubmit={handlePasswordChange}
                className="flex flex-col gap-5 w-full pt-6"
              >
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
          </div> */}
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
                {/* Avatar Preview & Upload Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-deep-blue-900/60 border border-white/5">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 shrink-0 bg-slate-800">
                    <img
                      src={avatarPreviewUrl || editAvatarUrl || user.avatarUrl}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-center sm:items-start gap-1.5 flex-1 w-full">
                    <span className="text-body-xs font-medium text-white">
                      Foto Profil
                    </span>
                    <input
                      ref={avatarFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedAvatarFile(file);
                          const objectUrl = URL.createObjectURL(file);
                          setAvatarPreviewUrl(objectUrl);
                        }
                      }}
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="py-1 px-3 text-body-xs"
                      >
                        <img
                          src="/assets/svg/fluent_edit-24-regular.svg"
                          alt="Upload"
                          className="w-3.5 h-3.5 filter-[brightness(0)_invert(0.8)]"
                        />
                        <span>Pilih Foto Avatar</span>
                      </Button>
                      {selectedAvatarFile && (
                        <span className="text-body-xs text-indigo-400 truncate max-w-45">
                          {selectedAvatarFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <InputField
                  label="Nama Pengguna"
                  placeholder="Masukkan nama tampilan"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  size="md"
                  containerClassName="bg-deep-blue-900/60"
                />

                <InputField
                  label="Atau Gunakan URL Foto Avatar"
                  placeholder="https://images.unsplash.com/..."
                  value={editAvatarUrl}
                  onChange={(e) => {
                    setEditAvatarUrl(e.target.value);
                    if (avatarPreviewUrl) {
                      setAvatarPreviewUrl(null);
                      setSelectedAvatarFile(null);
                    }
                  }}
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
        {toast && (
          <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 md:w-auto md:min-w-80 md:max-w-105 animate-fade-in">
            <Toast
              variant={toast.variant}
              title={toast.title}
              description={toast.description}
              onClose={() => setToast(null)}
            />
          </div>
        )}
      </StoreLayout>
    </>
  );
}
