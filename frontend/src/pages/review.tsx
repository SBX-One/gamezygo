import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import {
  Button,
  Field,
  TestimonialCard,
  Toast,
} from "@/components/ui";
import { useReviews, useCreateReview } from "@/hooks/use-reviews";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUserProfile } from "@/hooks/use-profile";

interface AttachedImage {
  id: string;
  name: string;
  url: string;
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

// Icon SVGs
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

const WifiOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 18.5C12.8284 18.5 13.5 17.8284 13.5 17C13.5 16.1716 12.8284 15.5 12 15.5C11.1716 15.5 10.5 16.1716 10.5 17C10.5 17.8284 11.1716 18.5 12 18.5Z"
      fill="currentColor"
    />
    <path
      d="M8.464 13.464C9.402 12.526 10.674 12 12 12C13.326 12 14.598 12.526 15.536 13.464M4.929 9.929C6.804 8.054 9.348 7 12 7C14.652 7 17.196 8.054 19.071 9.929M1.393 6.393C4.207 3.58 8.022 2 12 2C15.978 2 19.793 3.58 22.607 6.393M2 2L22 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ReloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4 12C4 7.58172 7.58172 4 12 4C15.5333 4 18.5285 6.29052 19.5702 9.5M20 12C20 16.4183 16.4183 20 12 20C8.4667 20 5.47147 17.7095 4.42975 14.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M20 4V10H14M4 20V14H10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    userName: "Cihuyy6767",
    avatarSrc:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review:
      '“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...',
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
    review:
      '“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...',
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
    review:
      '“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...',
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
    review:
      '“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...',
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
    review:
      '“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...',
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
    review:
      '“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh " test drive " buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...',
    gameName: "Black Myth Wukong, 2+",
    images: [
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg",
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg",
    ],
  },
];

export default function ReviewPage() {
  const router = useRouter();

  // Page preview state derived from query or local override
  const [previewStateOverride, setPreviewStateOverride] = React.useState<"default" | "error-500" | null>(null);
  const queryState =
    router.query.state === "error-500"
      ? "error-500"
      : router.query.state === "default"
      ? "default"
      : null;
  const previewState = previewStateOverride ?? queryState ?? "default";
  const setPreviewState = (state: "default" | "error-500") => {
    setPreviewStateOverride(state);
  };

  const { data: apiReviewsRes } = useReviews();
  const createReviewMutation = useCreateReview();
  const authUser = useAuthStore((s) => s.user);
  const { data: profileRes } = useUserProfile();

  const [reviews, setReviews] = React.useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [quickFeedback, setQuickFeedback] = React.useState("");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Review Modal State (Exact matching Image 1 & Image 2)
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRating, setSelectedRating] = React.useState<number>(0);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [modalComment, setModalComment] = React.useState("");
  const [attachedImages, setAttachedImages] = React.useState<AttachedImage[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const currentUser = {
    name: profileRes?.data?.name || authUser?.name || "Cihuy6767",
    email: profileRes?.data?.email || authUser?.email || "cihuy@gmail.com",
    avatarUrl:
      profileRes?.data?.avatar_url ||
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=120&h=120&q=80",
  };

  // Merge API reviews if available
  const displayReviews = React.useMemo(() => {
    if (apiReviewsRes?.data && apiReviewsRes.data.length > 0) {
      return apiReviewsRes.data.map((r) => ({
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
      }));
    }
    return reviews;
  }, [apiReviewsRes, reviews]);

  const handleToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenModal = (prefillFilled = false) => {
    if (prefillFilled) {
      // Prefill matching Image 1
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
      if (quickFeedback.trim()) {
        setModalComment(quickFeedback);
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
      const newItems: AttachedImage[] = Array.from(files).map((file, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }));
      setAttachedImages((prev) => [...prev, ...newItems]);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setAttachedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalComment.trim()) {
      handleToast("Mohon tulis pendapat atau ulasan Anda!");
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

    const formData = new FormData();
    formData.append("comment", modalComment.trim());
    formData.append("rating", String(selectedRating || 5));

    createReviewMutation.mutate(formData, {
      onSuccess: () => {
        setQuickFeedback("");
        handleClearAll();
        setIsModalOpen(false);
        handleToast("Ulasan Anda berhasil dikirim! Terima kasih atas pendapat Anda.");
      },
      onError: () => {
        // Fallback local update
        setReviews([newReview, ...reviews]);
        setQuickFeedback("");
        handleClearAll();
        setIsModalOpen(false);
        handleToast("Ulasan Anda berhasil ditambahkan!");
      },
    });
  };

  return (
    <>
      <Head>
        <title>Ulasan Pelanggan - Gamezygo</title>
        <meta
          name="description"
          content="Dengarkan pendapat gamer setelah beli akun game dan langganan di Gamezygo!"
        />
      </Head>

      <StoreLayout
        navbarVariant="private"
        activeSidebarId="ulasan"
        user={currentUser}
        onCartClick={() => handleToast("Membuka keranjang belanja")}
      >
        {/* ========================================================
            CASE A: 500 INTERNAL SERVER ERROR VIEW (Image 3)
           ======================================================== */}
        {previewState === "error-500" ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center select-none px-4 py-16">
            {/* Wifi Off Box */}
            <div className="w-14 h-14 rounded-lg bg-white/5 border border-gradient-secondary flex items-center justify-center text-white mb-6">
              <WifiOffIcon className="w-7 h-7 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-h4 sm:text-h3 font-bold text-white mb-2">
              500: Internal Server Error
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-body-sm  mx-auto mb-8 font-normal leading-relaxed">
              This page you&apos;re looking for doesn&apos;t exist or has been moved. Please check the URL or return to the homepage.
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="md"
                leftIcon={<ArrowLeftIcon className="w-4 h-4" />}
                onClick={() => setPreviewState("default")}
              >
                Kembali
              </Button>
              <Button
                variant="secondary"
                size="md"
                leftIcon={<ReloadIcon className="w-4 h-4" />}
                onClick={() => setPreviewState("default")}
              >
                Reload
              </Button>
            </div>
          </div>
        ) : (
          /* ========================================================
              CASE B: NORMAL REVIEW PAGE (Image 1 & Image 2)
             ======================================================== */
          <div className="flex flex-col gap-10xl w-full mx-auto pb-16 select-none">
            {/* ========================================================
                1. HEADER (Mirip Bundle: Border-L Merah + Input Field)
               ======================================================== */}
            <section className="flex flex-col gap-8 border-l-gradient-primary pl-6 sm:pl-8 relative">
              {/* Quick State Toggle for Dev/Preview */}
              <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-body-sm  text-gray-400 uppercase">
                  REVIEW
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewState("error-500")}
                  className="text-label-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded bg-white/5 border border-white/5 cursor-pointer"
                  title="Klik untuk melihat tampilan 500: Internal Server Error"
                >
                  Simulasikan 500 Error
                </button>
              </div>

              <h1 className="text-h3 sm:text-h2 xl:text-h1 font-bold text-gradient-heading w-fit">
                Dengarkan Pendapat Gamer
                <br />
                Setelah Beli di Gamezygo!
              </h1>
</div>
              {/* Quick Feedback Input Field */}
              <div className="pt-2 w-full sm:max-w-1/2 pb-6 ">
                <Field
                  placeholder="Beri pendapat"
                  size="md"
                  forceState="unfilled"
                  value={quickFeedback}
                  onChange={(e) => setQuickFeedback(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleOpenModal();
                    }
                  }}
                  leftIcon={
                    <img
                      src="/assets/svg/fluent_comment-note-24-regular.svg"
                      alt="Chat"
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
                      <img
                        src="/assets/svg/fluent_send-24-regular.svg"
                        alt="Send"
                        className="w-4.5 h-4.5 filter-[brightness(0)_invert(0.7)] hover:filter-[brightness(0)_invert(1)] transition-all"
                      />
                    </button>
                  }
                />
              </div>
            </section>

            {/* ========================================================
                2. TESTIMONIAL CARDS GRID (3 Columns Responsive, No Shadow)
               ======================================================== */}
            <section className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
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
            </section>
          </div>
        )}

        {/* ========================================================
            3. MODAL REVIEW INPUT (Exact Matching Image 1 & Image 2)
           ======================================================== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Dialog Card */}
            <div className="relative z-10 w-full  rounded-lg bg-deep-blue-900 border border-deep-blue-700/60 p-6 flex flex-col gap-6 select-none animate-scale-up shadow-none">
              {/* Header: Title + Close Icon */}
              <div className="flex items-center justify-between border-b border-gradient-secondary pb-4">
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
                  <span className="text-label-xs font-semibold tracking-wider text-gray-400 uppercase">
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
                              ? "bg-linear-to-r from-pale-red-500 to-rose-600 border border-rose-500/50 text-white"
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
                  <span className="text-label-xs font-semibold tracking-wider text-gray-400 uppercase">
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
                  <span className="text-label-xs font-semibold tracking-wider text-gray-400 uppercase">
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
                            <img
                              src={img.url}
                              alt={img.name}
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
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-5 py-2.5 rounded-lg bg-deep-blue-800 hover:bg-deep-blue-700 text-white text-body-sm font-medium transition-colors cursor-pointer border border-white/5 outline-none"
                  >
                    Hapus semua
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-linear-to-r from-pale-red-500 to-rose-600 hover:from-pale-red-600 hover:to-rose-700 text-white text-body-sm font-semibold transition-all cursor-pointer border-none outline-none shadow-none"
                  >
                    Kirim
                  </button>
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
