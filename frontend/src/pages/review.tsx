import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import {
  Button,
  Field,
  Header,
  Skeleton,
  TestimonialCard,
  Toast,
} from "@/components/ui";
import { useInfiniteReviews, useCreateReview } from "@/hooks/use-reviews";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUserProfile } from "@/hooks/use-profile";
import { MOCK_USER } from "@/lib/mock/data";

interface AttachedImage {
  id: string;
  name: string;
  url: string;
  file?: File;
}

interface ReviewItem {
  id: string;
  userName: string;
  avatarSrc?: string;
  rating: string;
  review: string;
  gameName: string;
  images: string[];
}

// ==========================================
// Icon SVGs
// ==========================================

const StarOutlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.788 3.102C11.283 2.099 12.714 2.099 13.209 3.102L15.567 7.88L20.84 8.646C21.947 8.806 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.283 21.342C6.293 21.862 5.135 21.022 5.323 19.919L6.224 14.668L2.409 10.948C1.608 10.168 2.05 8.807 3.157 8.646L8.43 7.88L10.788 3.102Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarFilledIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.788 3.102C11.283 2.099 12.714 2.099 13.209 3.102L15.567 7.88L20.84 8.646C21.947 8.806 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.283 21.342C6.293 21.862 5.135 21.022 5.323 19.919L6.224 14.668L2.409 10.948C1.608 10.168 2.05 8.807 3.157 8.646L8.43 7.88L10.788 3.102Z"
    />
  </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 5V19M5 12H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CrossIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
    {...props}
  >
    <path
      d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
      fill="currentColor"
    />
  </svg>
);

const COMMON_REVIEW_TEXT =
  '“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...';

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review: COMMON_REVIEW_TEXT,
    gameName: "Subscriber",
    images: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
    ],
  },
  {
    id: "rev-2",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review: COMMON_REVIEW_TEXT,
    gameName: "Black Myth Wukong, 2+",
    images: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
    ],
  },
  {
    id: "rev-3",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review: COMMON_REVIEW_TEXT,
    gameName: "Black Myth Wukong, 2+",
    images: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg",
    ],
  },
  {
    id: "rev-4",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review: COMMON_REVIEW_TEXT,
    gameName: "Black Myth Wukong, 2+",
    images: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
    ],
  },
  {
    id: "rev-5",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review: COMMON_REVIEW_TEXT,
    gameName: "Black Myth Wukong, 2+",
    images: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
    ],
  },
  {
    id: "rev-6",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review: COMMON_REVIEW_TEXT,
    gameName: "Black Myth Wukong, 2+",
    images: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg",
    ],
  },
];

// Guest Mock Reviews specifically matching Figma image (Top 3 text only, Bottom 3 with screenshots)
const GUEST_REVIEWS: ReviewItem[] = [
  {
    id: "guest-rev-1",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review: COMMON_REVIEW_TEXT,
    gameName: "Black Myth Wukong, 2+",
    images: [],
  },
  {
    id: "guest-rev-2",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review: COMMON_REVIEW_TEXT,
    gameName: "Black Myth Wukong, 2+",
    images: [],
  },
  {
    id: "guest-rev-3",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review: COMMON_REVIEW_TEXT,
    gameName: "Black Myth Wukong, 2+",
    images: [],
  },
  {
    id: "guest-rev-4",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review: COMMON_REVIEW_TEXT,
    gameName: "Black Myth Wukong, 2+",
    images: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1817070/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
    ],
  },
  {
    id: "guest-rev-5",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review: COMMON_REVIEW_TEXT,
    gameName: "Black Myth Wukong, 2+",
    images: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2379780/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg",
    ],
  },
  {
    id: "guest-rev-6",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review: COMMON_REVIEW_TEXT,
    gameName: "Black Myth Wukong, 2+",
    images: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=460&h=215&q=80",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg",
    ],
  },
];

export interface ReviewPageProps {
  isDashboardMode?: boolean;
}

export default function ReviewPage({ isDashboardMode = false }: ReviewPageProps) {
  const router = useRouter();

  const {
    data: reviewsPages,
    isLoading: isReviewsLoading,
    fetchNextPage: fetchNextReviewsPage,
    hasNextPage: hasNextReviewsPage,
    isFetchingNextPage: isFetchingNextReviewsPage,
  } = useInfiniteReviews();

  const { sentinelRef: reviewsSentinelRef } = useInfiniteScroll({
    hasNextPage: hasNextReviewsPage,
    isFetchingNextPage: isFetchingNextReviewsPage,
    fetchNextPage: fetchNextReviewsPage,
  });

  const apiReviewsItems = React.useMemo(() => {
    return reviewsPages?.pages?.flatMap((page) => page.data ?? []) ?? [];
  }, [reviewsPages]);
  const createReviewMutation = useCreateReview();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authUser = useAuthStore((s) => s.user);
  const { data: profileRes } = useUserProfile();

  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoggedIn = isMounted && Boolean(isAuthenticated || authUser);

  // Tampilan Dashboard jika:
  // 1. isDashboardMode prop bernilai true (misal dipanggil dari /dashboard/review)
  // 2. Routing Next.js diawali dengan /dashboard
  // 3. Pengguna sudah login (autentikasi aktif) kecuali sengaja meminta ?view=guest
  // 4. Query string ?view=dashboard
  const isDashboardView = Boolean(
    isDashboardMode ||
      router.pathname.startsWith("/dashboard") ||
      router.query.view === "dashboard" ||
      (isLoggedIn && router.query.view !== "guest")
  );
  const isGuestView = !isDashboardView;

  const [reviews, setReviews] = React.useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [localReviews, setLocalReviews] = React.useState<ReviewItem[]>([]);
  const [quickFeedback, setQuickFeedback] = React.useState("");
  const [guestOpinionInput, setGuestOpinionInput] = React.useState("");

  // Load persistent reviews from localStorage
  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("gamezygo_user_reviews");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const timer = setTimeout(() => {
              setLocalReviews(parsed);
            }, 0);
            return () => clearTimeout(timer);
          }
        }
      }
    } catch {
      // ignore storage parsing error
    }
  }, []);

  const saveReviewLocally = (item: ReviewItem) => {
    setLocalReviews((prev) => {
      const updated = [item, ...prev.filter((p) => p.id !== item.id)];
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("gamezygo_user_reviews", JSON.stringify(updated));
        }
      } catch {
        // ignore storage write error
      }
      return updated;
    });
  };

  // Review Modal State (Exact matching Image 1 & Image 2)
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRating, setSelectedRating] = React.useState<number>(0);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [modalComment, setModalComment] = React.useState("");
  const [attachedImages, setAttachedImages] = React.useState<AttachedImage[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const currentUser = {
    name: profileRes?.data?.name || authUser?.name || MOCK_USER.name,
    email: profileRes?.data?.email || authUser?.email || MOCK_USER.email,
    avatarUrl:
      profileRes?.data?.avatar_url ||
      authUser?.avatarUrl ||
      MOCK_USER.avatarUrl,
  };

  // Merge API reviews with local user-submitted reviews at the top
  const displayReviews = React.useMemo(() => {
    const apiMapped: ReviewItem[] =
      apiReviewsItems.length > 0
        ? apiReviewsItems.map((r) => ({
            id: String(r.id),
            userName: r.user?.name || "Pelanggan Gamezygo",
            avatarSrc:
              r.user?.avatar_url ||
              "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&h=120&q=80",
            rating: `${r.rating || 5} Star`,
            review: r.review,
            gameName: "Black Myth Wukong, 2+",
            images: (r.images || [])
              .map((img) => img.url || img.file_url || "")
              .filter((url): url is string => Boolean(url)),
          }))
        : reviews;

    // Filter out duplicates from API
    const userUnique = localReviews.filter(
      (lr) => !apiMapped.some((ar) => ar.id === lr.id)
    );

    return [...userUnique, ...apiMapped];
  }, [apiReviewsItems, localReviews, reviews]);

  const [toast, setToast] = React.useState<{
    title: string;
    description: string;
    variant: "success" | "error" | "warning";
  } | null>(null);

  const handleToast = (
    msg: string,
    variant: "success" | "error" | "warning" = "success",
    title = variant === "error" ? "Peringatan" : "Berhasil"
  ) => {
    setToast({ title, description: msg, variant });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleOpenModal = (prefillFilled = false) => {
    if (prefillFilled) {
      setSelectedRating(5);
      setModalComment(
        '“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik'
      );
      setAttachedImages([
        {
          id: "img-123",
          name: "123.jpg",
          url: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
        },
      ]);
    } else {
      const activeInput = isGuestView ? guestOpinionInput : quickFeedback;
      if (activeInput.trim()) {
        setModalComment(activeInput);
        setSelectedRating(5);
      } else {
        setSelectedRating(0);
        setModalComment("");
        setAttachedImages([]);
      }
    }
    setIsModalOpen(true);
  };

  const handleClearAll = () => {
    setSelectedRating(0);
    setHoverRating(0);
    setModalComment("");
    setAttachedImages([]);
  };

  const handlePickImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          const dataUrl =
            (uploadEvent.target?.result as string) || URL.createObjectURL(file);
          setAttachedImages((prev) => [
            ...prev,
            {
              id: `img-${Date.now()}-${idx}-${Math.random()}`,
              name: file.name,
              url: dataUrl,
              file,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
      e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setAttachedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalComment.trim()) {
      handleToast("Mohon tulis pendapat atau ulasan Anda!", "error");
      return;
    }

    const ratingStars = selectedRating > 0 ? `${selectedRating} Star` : "5 Star";
    const imageUrls =
      attachedImages.length > 0
        ? attachedImages.map((img) => img.url)
        : [
            "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
            "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg",
            "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
          ];

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      userName: currentUser.name,
      avatarSrc: currentUser.avatarUrl,
      rating: ratingStars,
      review: modalComment.trim().startsWith("“")
        ? modalComment.trim()
        : `“${modalComment.trim()}”`,
      gameName: "Black Myth Wukong, 2+",
      images: imageUrls,
    };

    // 1. Immediately save locally so that it appears without waiting and persists
    saveReviewLocally(newReview);
    setReviews((prev) => [newReview, ...prev]);

    // 2. Instantly close modal, reset inputs, and show success toast (Zero latency optimistic UI)
    setIsModalOpen(false);
    setQuickFeedback("");
    setGuestOpinionInput("");
    handleClearAll();
    handleToast("Ulasan Anda berhasil ditambahkan!", "success");

    // 3. Fire backend sync silently in background without blocking UI
    const formData = new FormData();
    formData.append("review", modalComment.trim());
    formData.append("comment", modalComment.trim());
    attachedImages.forEach((img) => {
      if (img.file) {
        formData.append("images[]", img.file);
      }
    });
    formData.append("rating", String(selectedRating || 5));

    createReviewMutation.mutate(formData, {
      onError: (err) => {
        // Keep optimistic state active and silently log background sync error
        console.debug("Background review sync:", err);
      },
    });
  };

  const handleSendGuestOpinion = () => {
    if (!guestOpinionInput.trim()) {
      handleToast("Mohon tuliskan pendapat Anda terlebih dahulu!", "error");
      return;
    }
    setGuestOpinionInput("");
    if (useAuthStore.getState().role === "guest") {
      router.push("/login");
    } else {
      router.push("/review");
    }
  };

  // Shared Review Modal (Used in both guest and customer views)
  const renderReviewModal = () => (
    isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsModalOpen(false)}
        />

        {/* Modal Dialog Card */}
        <div className="relative z-10 w-full max-w-2.5/3 sm:max-w-1/3 rounded-lg bg-deep-blue-900 border border-deep-blue-700/60 p-6 flex flex-col gap-6 select-none animate-scale-up shadow-none">
          {/* Header: Title + Close Icon */}
          <div className="flex items-center justify-between border-b-gradient-secondary pb-4">
            <h3 className="text-body-lg font-bold text-white">
              Review
            </h3>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer outline-none"
              aria-label="Tutup modal"
            >
              <CrossIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmitReview} className="flex flex-col gap-5">
            {/* 1. RATING SECTION */}
            <div className="flex flex-col gap-2.5">
              <span className="text-label-xs font-semibold text-gray-400 uppercase">
                RATING
              </span>
              <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating || selectedRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`h-11 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 outline-none ${
                        isActive
                          ? "bg-surface-primary-default text-white"
                          : "bg-deep-blue-900 border border-deep-blue-700/60 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                      }`}
                      aria-label={`Pilih rating ${star} bintang`}
                    >
                      {isActive ? (
                        <StarFilledIcon className="w-5 h-5 fill-white text-white" />
                      ) : (
                        <StarOutlineIcon className="w-5 h-5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. DETAIL PESANAN SECTION */}
            <div className="flex flex-col gap-2.5">
              <span className="text-label-xs font-semibold text-gray-400 uppercase">
                DETAIL PESANAN
              </span>
              <textarea
                rows={modalComment ? 4 : 2}
                placeholder="Tambahkan pendapat"
                value={modalComment}
                onChange={(e) => setModalComment(e.target.value)}
                className="w-full rounded-lg bg-deep-blue-900 border border-deep-blue-700/60 p-4 text-body-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-neutral-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* 3. GAMBAR SECTION */}
            <div className="flex flex-col gap-2.5">
              <span className="text-label-xs font-semibold text-gray-400 uppercase">
                GAMBAR
              </span>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />

              {/* Tambahkan Gambar Trigger */}
              <div
                onClick={handlePickImage}
                className="w-full rounded-lg bg-deep-blue-900 border border-deep-blue-700/60 px-4 py-3 flex items-center justify-between cursor-pointer hover:border-deep-blue-600 transition-all text-body-sm text-gray-400 hover:text-gray-200"
              >
                <span>Tambahkan gambar</span>
                <PlusIcon className="w-4.5 h-4.5 text-gray-400" />
              </div>

              {/* Attached Images List (Matching Image 1) */}
              {attachedImages.length > 0 && (
                <div className="flex flex-col gap-2">
                  {attachedImages.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="w-full rounded-lg bg-deep-blue-900 border border-deep-blue-700/60 px-3 py-2 flex items-center justify-between text-body-sm text-gray-200"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Image
                          src={img.url}
                          alt={img.name}
                          width={56}
                          height={32}
                          unoptimized
                          className="w-14 h-8 object-cover rounded-md border border-gradient-secondary shrink-0"
                        />
                        <span className="text-body-sm text-gray-300 font-normal truncate">
                          {img.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                        title="Hapus gambar"
                      >
                        <CrossIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons (Right Aligned: Hapus semua & Kirim) */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                onClick={handleClearAll}
                variant={"secondary"}
                size={"sm"}
                className="py-2.5"
              >
                Hapus semua
              </Button>
              <Button
              variant={"primary"}
              size={"sm"}
                type="submit"
                className="py-2.5"
              >
                Kirim
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  );

  return (
    <>
      <Head>
        <title>
          {isDashboardView
            ? "Ulasan Saya - Dashboard Gamezygo"
            : "Ulasan Pelanggan - Gamezygo"}
        </title>
        <meta
          name="description"
          content={
            isDashboardView
              ? "Kelola dan lihat ulasan akun game dan pengalaman Anda di Gamezygo."
              : "Dengarkan pendapat gamer setelah beli akun game dan langganan di Gamezygo!"
          }
        />
      </Head>

      {/* =========================================================================
          VIEW A: GUEST REVIEW PAGE (Matching User Mockup: Public Header + Grid + Pagination)
         ========================================================================= */}
      {isGuestView ? (
        <StoreLayout
          navbarVariant="guest"
          activeNavId="ulasan"
          hideSidebar={true}
          user={authUser ? currentUser : undefined}
          onLoginClick={() => router.push("/login")}
          onSignUpClick={() => router.push("/login?tab=signup")}
          onCartClick={() => router.push("/cart")}
          contentClassName="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-20 py-10 sm:py-16 flex flex-col gap-8xl sm:gap-11xl select-none"
        >

          {/* 1. HERO SECTION: Centered Header with Input & Rating Stats */}
          <section className="w-full flex flex-col items-center justify-center text-center">
            <Header
              as="h1"
              pillText="Promo Musim Panas Telah Datang!"
              pillVariant="secondary"
              title="Dengarkan Pendapat Gamer Setelah Beli di Gamezygo!"
              className="max-w-6/7 sm:max-w-4/7 mx-auto"
            >
              <div className="flex flex-col items-center gap-6 w-full mt-2">
                {/* "Beri Pendapat" Input Bar */}
                <div className="relative w-full sm:max-w-1/2 mx-auto">
                  <div className="w-full flex items-center bg-deep-blue-900 border border-white/10 rounded-xl px-4 py-3 gap-3 focus-within:border-white/30 transition-all shadow-lg">
                    <span className="text-gray-400 text-body-sm font-semibold">@</span>
                    <input
                      type="text"
                      value={guestOpinionInput}
                      onChange={(e) => setGuestOpinionInput(e.target.value)}
                      placeholder="Beri pendapat"
                      className="w-full bg-transparent text-body-sm text-gray-100 placeholder:text-gray-500 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendGuestOpinion();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSendGuestOpinion}
                      className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer outline-none shrink-0"
                      aria-label="Kirim pendapat"
                      title="Kirim pendapat"
                    >
                      <SendIcon className="w-4 h-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>

                {/* 5-Star Rating & Review Count */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarFilledIcon key={i} className="w-4.5 h-4.5 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="font-bold text-white text-body-sm sm:text-body-md">4.8</span>
                  </div>
                  <p className="text-gray-400 text-body-sm -mt-0.5">
                    Dari 80K+{" "}
                    <span
                        onClick={useAuthStore.getState().role === "guest" ? () => router.push("/login") :  () => router.push("/review") }
                        className="underline cursor-pointer hover:text-white transition-colors font-medium"
                    >
                      ulasan
                    </span>
                  </p>
                </div>
              </div>
            </Header>
          </section>

          {/* 2. TESTIMONIAL CARDS GRID (3 Columns Responsive) + INFINITE SCROLL */}
          <section className="w-full grid gap-10xl">
            {isReviewsLoading && apiReviewsItems.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8xl gap-x-5 w-full">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8xl gap-x-5 w-full">
                  {(displayReviews.length > 0 ? displayReviews : GUEST_REVIEWS).map((item) => (
                    <TestimonialCard
                      key={item.id}
                      userName={item.userName}
                      avatarSrc={item.avatarSrc}
                      rating={item.rating}
                      review={item.review}
                      gameName={item.gameName}
                      images={item.images && item.images.length > 0 ? item.images : false}
                      className="h-full justify-between"
                    />
                  ))}
                </div>
                {isFetchingNextReviewsPage && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8xl gap-x-5 w-full">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col gap-4"
                      >
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    ))}
                  </div>
                )}
                <div ref={reviewsSentinelRef} className="h-4 w-full" aria-hidden="true" />
              </>
            )}
          </section>

          {renderReviewModal()}
        </StoreLayout>
      ) : (
        /* =========================================================================
            VIEW B: CUSTOMER REVIEW DASHBOARD (Logged-In User: Sidebar + Error 500 + Modal)
           ========================================================================= */
        <StoreLayout
          navbarVariant="private"
          activeSidebarId="ulasan"
          user={currentUser}
        >
            <div className="flex flex-col gap-10xl w-full  mx-auto pb-16 select-none ">
              {/* 1. HEADER (Mirip Bundle: Border-L Merah + Input Field) */}
              <section className="flex flex-col gap-8 border-l-gradient-primary pl-6 sm:pl-8 relative">
                <div className="grid gap-4">
                  <span className="text-body-sm text-gray-400 uppercase">
                    REVIEW
                  </span>

                  <h1 className="text-h3 sm:text-h2 xl:text-h1 font-bold text-gradient-heading w-fit">
                    Dengarkan Pendapat Gamer
                    <br />
                    Setelah Beli di Gamezygo!
                  </h1>
                </div>

                {/* Quick Feedback Input Field */}
                <div className="pt-2 w-full max-w-5/7 sm:max-w-3/7 pb-6">
                  <Field
                    placeholder="Beri pendapat"
                    size="md"
                    forceState="unfilled"
                    value={quickFeedback}
                    onChange={(e) => setQuickFeedback(e.target.value)}
                     onClick={() => handleOpenModal()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleOpenModal();
                      }
                    }}
                    leftIcon={
                      <Image
                        src="/assets/svg/fluent_comment-note-24-regular.svg"
                        alt="Chat"
                        width={18}
                        height={18}
                        className="w-4.5 h-4.5 filter-[brightness(0)_invert(0.7)]"
                      />
                    }
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => handleOpenModal()}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer outline-none"
                        aria-label="Kirim pendapat"
                        title="Kirim pendapat"
                      >
                        <Image
                          src="/assets/svg/fluent_send-24-regular.svg"
                          alt="Send"
                          width={18}
                          height={18}
                          className="w-4.5 h-4.5 filter-[brightness(0)_invert(0.7)] hover:filter-[brightness(0)_invert(1)] transition-all"
                        />
                      </button>
                    }
                  />
                </div>
              </section>

              {/* 2. TESTIMONIAL CARDS GRID (3 Columns Responsive, No Shadow) */}
              <section className="w-full">
                {isReviewsLoading && apiReviewsItems.length === 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8xl gap-x-5 w-full">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8xl gap-x-5 w-full">
                      {displayReviews.map((item) => (
                        <TestimonialCard
                          key={item.id}
                          userName={item.userName}
                          avatarSrc={item.avatarSrc}
                          rating={item.rating}
                          review={item.review}
                          gameName={item.gameName}
                          images={item.images}
                          className="h-full shadow-none"
                        />
                      ))}
                    </div>
                    {isFetchingNextReviewsPage && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8xl gap-x-5 w-full mt-6">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 flex flex-col gap-4"
                          >
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                          </div>
                        ))}
                      </div>
                    )}
                    <div ref={reviewsSentinelRef} className="h-4 w-full" aria-hidden="true" />
                  </>
                )}
              </section>
            </div>

          {renderReviewModal()}
        </StoreLayout>
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
    </>
  );
}
