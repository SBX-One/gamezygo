import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import { cn } from "@/lib/utils";
import {
  Breadcrumbs,
  Button,
  Pill,
  TestimonialCard,
  Toast,
} from "@/components/ui";
import {
  fetchSteamGame,
  parseSteamRequirements,
  type SteamGameDetails,
  type ParsedSystemRequirements,
} from "@/services/steam";
import productsData from "@/json/products.json";
import { OWNED_LIBRARY_GAMES } from "@/pages/library";
import { useGameCredentials } from "@/hooks/use-library";

// ============================================================================
// SVG ICONS
// ============================================================================

const SteamIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 fill-current shrink-0"
    {...props}
  >
    <path
      d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22C7.4 22 3.55 18.92 2.36 14.73L6.19 16.31C6.32124 16.9506 6.66949 17.5262 7.17597 17.9398C7.68245 18.3534 8.31612 18.5795 8.97 18.58C10.53 18.58 11.8 17.31 11.8 15.75V15.62L15.2 13.19H15.28C17.36 13.19 19.05 11.5 19.05 9.42C19.05 7.34 17.36 5.65 15.28 5.65C13.2 5.65 11.5 7.34 11.5 9.42V9.47L9.13 12.93L8.97 12.92C8.38 12.92 7.83 13.1 7.38 13.41L2 11.2C2.43 6.05 6.73 2 12 2ZM8.28 17.17C9.08 17.5 10 17.13 10.33 16.33C10.66 15.53 10.28 14.62 9.5 14.29L8.22 13.76C8.71 13.58 9.26 13.57 9.78 13.79C10.31 14 10.72 14.41 10.93 14.94C11.15 15.46 11.15 16.04 10.93 16.56C10.5 17.64 9.23 18.16 8.15 17.71C7.65 17.5 7.27 17.12 7.06 16.67L8.28 17.17ZM17.8 9.42C17.8 10.81 16.67 11.94 15.28 11.94C14.6134 11.9374 13.975 11.6707 13.5046 11.1984C13.0341 10.7261 12.77 10.0866 12.77 9.42C12.7687 9.09001 12.8327 8.76303 12.9584 8.4579C13.084 8.15278 13.2689 7.87555 13.5022 7.64221C13.7356 7.40887 14.0128 7.22404 14.3179 7.09837C14.623 6.9727 14.95 6.90868 15.28 6.91C15.9466 6.90999 16.5861 7.17412 17.0584 7.64455C17.5307 8.11498 17.7974 8.75339 17.8 9.42ZM13.4 9.42C13.4 10.46 14.24 11.31 15.29 11.31C16.33 11.31 17.17 10.46 17.17 9.42C17.17 8.38 16.33 7.53 15.29 7.53C14.24 7.53 13.4 8.38 13.4 9.42Z"
      fill="currentColor"
    />
  </svg>
);

const DefaultPeopleSearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    {...props}
  >
    <path
      d="M11.91 14H19.753C20.3498 14 20.9221 14.2371 21.344 14.659C21.766 15.081 22.003 15.6533 22.003 16.25V17.155C22.003 17.6954 21.8862 18.2294 21.6607 18.7204C21.4351 19.2115 21.106 19.648 20.696 20C19.13 21.345 16.89 22.002 14 22.002H13.821C13.9719 21.6984 14.0314 21.3575 13.9921 21.0207C13.9529 20.6839 13.8167 20.3658 13.6 20.105L13.489 19.984L11.259 17.76C11.9192 16.625 12.1508 15.2907 11.91 14ZM6.50004 10.5C7.3549 10.5 8.19207 10.7436 8.91355 11.2021C9.63504 11.6606 10.211 12.3152 10.574 13.0891C10.937 13.8631 11.072 14.7244 10.9633 15.5724C10.8546 16.4203 10.5066 17.2197 9.96004 17.877L12.783 20.691C12.9163 20.8248 12.9942 21.004 13.0011 21.1928C13.008 21.3816 12.9435 21.566 12.8203 21.7092C12.6972 21.8524 12.5245 21.9439 12.3369 21.9654C12.1492 21.9869 11.9604 21.9367 11.808 21.825L11.723 21.753L8.82004 18.857C8.22564 19.2143 7.5567 19.4293 6.86547 19.4853C6.17424 19.5413 5.47941 19.4368 4.83523 19.18C4.19105 18.9231 3.61496 18.5208 3.15192 18.0045C2.68889 17.4883 2.35144 16.872 2.16594 16.2037C1.98043 15.5355 1.95188 14.8334 2.08251 14.1524C2.21314 13.4713 2.49942 12.8296 2.919 12.2774C3.33858 11.7252 3.88011 11.2775 4.5013 10.9692C5.1225 10.6609 5.80654 10.5003 6.50004 10.5ZM6.50004 12C5.7044 12 4.94133 12.3161 4.37872 12.8787C3.81612 13.4413 3.50004 14.2044 3.50004 15C3.50004 15.7957 3.81612 16.5587 4.37872 17.1213C4.94133 17.6839 5.7044 18 6.50004 18C7.29569 18 8.05876 17.6839 8.62137 17.1213C9.18397 16.5587 9.50004 15.7957 9.50004 15C9.50004 14.2044 9.18397 13.4413 8.62137 12.8787C8.05876 12.3161 7.29569 12 6.50004 12ZM14 2.005C14.6567 2.005 15.3068 2.13433 15.9135 2.38561C16.5201 2.63688 17.0713 3.00518 17.5356 3.46947C17.9999 3.93376 18.3682 4.48496 18.6194 5.09159C18.8707 5.69822 19 6.3484 19 7.005C19 7.66161 18.8707 8.31179 18.6194 8.91842C18.3682 9.52505 17.9999 10.0762 17.5356 10.5405C17.0713 11.0048 16.5201 11.3731 15.9135 11.6244C15.3068 11.8757 14.6567 12.005 14 12.005C12.674 12.005 11.4022 11.4782 10.4645 10.5405C9.52683 9.60286 9.00004 8.33109 9.00004 7.005C9.00004 5.67892 9.52683 4.40715 10.4645 3.46947C11.4022 2.53179 12.674 2.005 14 2.005Z"
      fill="currentColor"
    />
  </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarFilledIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5 fill-current shrink-0"
    {...props}
  >
    <path
      d="M10.788 3.10198C11.283 2.09898 12.714 2.09898 13.209 3.10198L15.567 7.87998L20.84 8.64598C21.947 8.80598 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.28303 21.342C6.29303 21.862 5.13503 21.022 5.32303 19.919L6.22403 14.668L2.40903 10.948C1.60803 10.168 2.05003 8.80698 3.15703 8.64598L8.43003 7.87998L10.788 3.10198Z"
      fill="currentColor"
    />
  </svg>
);

const StarRegularIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5 fill-current shrink-0"
    {...props}
  >
    <path
      d="M10.788 3.10198C11.283 2.09898 12.714 2.09898 13.209 3.10198L15.567 7.87998L20.84 8.64598C21.947 8.80598 22.389 10.168 21.588 10.949L17.772 14.668L18.673 19.918C18.863 21.022 17.705 21.863 16.714 21.342L11.998 18.862L7.28303 21.342C6.29303 21.862 5.13503 21.022 5.32303 19.919L6.22403 14.668L2.40903 10.948C1.60803 10.168 2.05003 8.80698 3.15703 8.64598L8.43003 7.87998L10.788 3.10198ZM11.998 4.03898L9.74003 8.61398C9.64327 8.81029 9.50023 8.98013 9.32323 9.10887C9.14624 9.23761 8.9406 9.32139 8.72403 9.35298L3.67403 10.087L7.32803 13.649C7.64603 13.959 7.79103 14.406 7.71603 14.844L6.85403 19.873L11.37 17.498C11.5638 17.396 11.7795 17.3428 11.9985 17.3428C12.2175 17.3428 12.4332 17.396 12.627 17.498L17.143 19.873L16.281 14.843C16.2442 14.6274 16.2602 14.4061 16.3278 14.1981C16.3954 13.9901 16.5125 13.8017 16.669 13.649L20.323 10.087L15.273 9.35298C15.0565 9.32139 14.8508 9.23761 14.6738 9.10887C14.4968 8.98013 14.3538 8.81029 14.257 8.61398L11.998 4.03898Z"
      fill="currentColor"
    />
  </svg>
);

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="9"
      y="9"
      width="13"
      height="13"
      rx="2"
      ry="2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserBadgeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="9"
      cy="7"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="19"
      cy="11"
      r="2"
      fill="currentColor"
    />
  </svg>
);

// ============================================================================
// MOCK TESTIMONIAL DATA
// ============================================================================

const TESTIMONIALS_DATA = [
  {
    id: "t-1",
    userName: "Cihuyy6767",
    gameName: "Black Myth Wukong, 2+",
    avatarSrc: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review:
      "“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy, harga game mahal bgt? dan buat gue yg butuh \" test drive \" buat game yg harganya mahal itu kayanya ini jadi solusi terbaik...”",
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=320&h=180&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=320&h=180&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=320&h=180&q=80",
    ],
  },
  {
    id: "t-2",
    userName: "Rendy Pratama",
    gameName: "Assassin's Creed Black Flag",
    avatarSrc: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review:
      "“Proses instan banget, begitu selesai bayar langsung muncul username sama passwordnya. Akun lancar jaya tinggal switch Steam ke offline mode trus tamatin story-nya tanpa gangguan. Recommended seller!”",
    images: [
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=320&h=180&q=80",
      "https://images.unsplash.com/photo-1552824722-ddab1374e622?auto=format&fit=crop&w=320&h=180&q=80",
    ],
  },
  {
    id: "t-3",
    userName: "Bima_Gaming99",
    gameName: "Elden Ring: Shadow of the Erdtree",
    avatarSrc: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review:
      "“Awalnya ragu beli shared account, pas dicoba ternyata gampang banget tutorialnya. Adminnya juga responsif pas ditanya cara aktivasi offline. Hemat ratusan ribu buat main game AAA impian!”",
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=320&h=180&q=80",
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=320&h=180&q=80",
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=320&h=180&q=80",
    ],
  },
  {
    id: "t-4",
    userName: "Aldo_Kurnia",
    gameName: "Cyberpunk 2077: Phantom Liberty",
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    rating: "5 Star",
    review:
      "“Gamezygo penyelamat dompet mahasiswa! Spek game detail banget ditampilin jadi sebelum beli tau kuat apa ngga PC gue. Sukses terus Gamezygo!”",
    images: [
      "https://images.unsplash.com/photo-1612287233216-52c6f1f8b65c?auto=format&fit=crop&w=320&h=180&q=80",
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=320&h=180&q=80",
    ],
  },
];

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function GameCredentialPage() {
  const router = useRouter();
  const { id } = router.query;

  // Local state
  const [steamData, setSteamData] = React.useState<SteamGameDetails | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = React.useState(0);
  const [showUsername, setShowUsername] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [opinionInput, setOpinionInput] = React.useState("");

  // Quadrupled items for seamless infinite moving carousel (matching blogs/[id].tsx)
  const infiniteTestimonials = React.useMemo(() => {
    return [
      ...TESTIMONIALS_DATA,
      ...TESTIMONIALS_DATA,
      ...TESTIMONIALS_DATA,
      ...TESTIMONIALS_DATA,
    ];
  }, []);

  // Match game in local library games OR catalog products
  const matchedProduct = React.useMemo(() => {
    if (!id || typeof id !== "string") return null;

    const allProducts = [
      ...OWNED_LIBRARY_GAMES,
      ...((productsData as { miniFeatured?: Array<Record<string, unknown>> }).miniFeatured || []),
      ...((productsData as { tawaranKhusus?: Array<Record<string, unknown>> }).tawaranKhusus || []),
    ];

    const found = allProducts.find(
      (p) =>
        String(p.id).toLowerCase() === id.toLowerCase() ||
        String((p as { steamAppId?: number }).steamAppId) === id
    );

    if (found) {
      const steamAppId =
        (found as { steamAppId?: number }).steamAppId ||
        Number(String((found as { imageSrc?: string }).imageSrc).match(/\/apps\/(\d+)\//)?.[1]) ||
        242050;

      return {
        ...found,
        steamAppId,
        bannerSrc:
          (found as { bannerSrc?: string }).bannerSrc ||
          `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppId}/header.jpg`,
      };
    }

    // If id itself is a numeric Steam App ID (e.g. /credentials/271590)
    const numericId = Number(id);
    if (!isNaN(numericId) && numericId > 0) {
      return {
        id,
        steamAppId: numericId,
        title: steamData?.name || `Steam Game #${numericId}`,
        originalPrice: "Rp 350.000",
        price: "Rp 210.000",
        discount: "-40%",
        imageSrc: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${numericId}/library_600x900_2x.jpg`,
        bannerSrc: `https://cdn.akamai.steamstatic.com/steam/apps/${numericId}/header.jpg`,
        genres: ["Action", "Adventure"],
      };
    }

    return {
      id: id,
      steamAppId: 242050,
      title: "Assassin's Creed : Black Flag Resynced",
      originalPrice: "Rp 313.500",
      price: "Rp 219.500",
      discount: "-30%",
      imageSrc:
        "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
      bannerSrc:
        "https://cdn.akamai.steamstatic.com/steam/apps/242050/header.jpg",
      genres: ["Action", "Adventure"],
    };
  }, [id, steamData?.name]);

  // Pre-order detection: query param (?preorder=true or ?state=pre-order), product status, or game state
  const isPreorder = React.useMemo(() => {
    if (router.query.preorder === "true" || router.query.state === "pre-order") return true;
    if (router.query.preorder === "false") return false;
    const prod = matchedProduct as { isPreorder?: boolean; state?: string; status?: string } | null;
    return Boolean(prod?.isPreorder || prod?.state === "pre-order" || prod?.status === "pre-order");
  }, [router.query.preorder, router.query.state, matchedProduct]);

  // Resolved genres list (supporting multiple genres with slider)
  const gameGenres = React.useMemo(() => {
    if (steamData?.genres && steamData.genres.length > 0) {
      return steamData.genres;
    }
    if (
      Array.isArray((matchedProduct as { genres?: string[] })?.genres) &&
      (matchedProduct as { genres?: string[] }).genres!.length > 0
    ) {
      return (matchedProduct as { genres?: string[] }).genres!;
    }
    return ["Aksi", "Petualangan", "RPG", "Dunia Terbuka"];
  }, [steamData, matchedProduct]);

  // Fetch Steam Game Details (including pc_requirements)
  const appId = (matchedProduct as { steamAppId?: number })?.steamAppId || 242050;

  React.useEffect(() => {
    let isMounted = true;

    fetchSteamGame(appId)
      .then((data) => {
        if (isMounted) {
          setSteamData(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching steam data:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [appId]);

  // Parse Minimum & Recommended specifications from Steam Store API
  const minSpecs: ParsedSystemRequirements = React.useMemo(() => {
    return parseSteamRequirements(steamData?.pc_requirements?.minimum, {
      os: "Windows 10 (64-bit)",
      cpu: "Intel Core i5-2500K @ 3.3 GHz / AMD FX-6300 @ 3.5 GHz",
      ram: "8 GB RAM",
      gpu: "NVIDIA GeForce GTX 660 / AMD Radeon HD 7870 (2GB VRAM)",
      directx: "Versi 11",
      storage: "30 GB Available Space",
      soundCard: "DX9 compliant",
    });
  }, [steamData?.pc_requirements?.minimum]);

  const recSpecs: ParsedSystemRequirements = React.useMemo(() => {
    return parseSteamRequirements(steamData?.pc_requirements?.recommended, {
      os: "Windows 11 (64-bit)",
      cpu: "Intel Core i7-4770 @ 3.4 GHz / AMD Ryzen 5 1600 @ 3.2 GHz",
      ram: "16 GB RAM",
      gpu: "NVIDIA GeForce GTX 970 / AMD Radeon R9 290 (4GB VRAM)",
      directx: "Versi 12",
      storage: "30 GB Available Space",
      soundCard: "DX9 compliant",
    });
  }, [steamData?.pc_requirements?.recommended]);

  // Gallery screenshots from Steam or fallback
  const mediaList = React.useMemo(() => {
    if (steamData?.screenshots && steamData.screenshots.length > 0) {
      return steamData.screenshots.slice(0, 5).map((s) => s.full || s.thumbnail);
    }
    const banner =
      (matchedProduct as { bannerSrc?: string })?.bannerSrc ||
      `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
    return [
      banner,
      (matchedProduct as { imageSrc?: string })?.imageSrc ||
        `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900_2x.jpg`,
    ];
  }, [steamData, matchedProduct, appId]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToastMessage(`${label} berhasil disalin ke clipboard!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dynamic Game Title & Description
  const gameTitle =
    steamData?.name ||
    (matchedProduct as { title?: string })?.title ||
    "Assassin's Creed : Black Flag Resynced";

  const gameDescription =
    (matchedProduct as { description?: string })?.description ||
    steamData?.description ||
    "“gue gatau ada berapa org dibalik bisnis ini, 1 atau seberapapun org terlibat, gue mengapresiasi sebesar besarnya udah ada jasa kaya gini. in this economy.”";

  // Fetch credentials from API (GET /api/v1/user/products/:slug/credentials)
  const productSlug = typeof id === "string" ? id : "";
  const { data: credentialsRes } = useGameCredentials(productSlug);

  // Account Credentials for the specific game (with graceful fallback)
  const fallbackUsername = `shared_steam_${String(
    (matchedProduct as { title?: string })?.title || id || "ac4"
  )
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8)}_01`;
  const fallbackPassword = "GamezygoPassword2026!";

  const accountUsername = credentialsRes?.data?.username || fallbackUsername;
  const accountPassword = credentialsRes?.data?.password || fallbackPassword;

  return (
    <>
      <Head>
        <title>{`${gameTitle} — Akun & Kredensial | Gamezygo`}</title>
        <meta
          name="description"
          content={`Informasi kredensial login akun dan panduan bermain ${gameTitle} di Gamezygo.`}
        />
      </Head>

      <StoreLayout 
        navbarVariant="private">
        <div className="w-full flex flex-col gap-10 lg:gap-11xl pb-16">
          {/* =========================================================================
              B. HERO SECTION (GAME MEDIA & CREDENTIAL CARD)
              ========================================================================= */}
          <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column: Media Preview, Carousel & Badges (7 cols) */}
            <div className=" h-full flex flex-col gap-8">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Perpustakaan", href: "/library" },
                { label: gameTitle },
              ]}
            />

              {/* Main Media Display */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-deep-blue-900 border border-white/10 shadow-lg group">
                <img
                  src={mediaList[activeMediaIndex] || mediaList[0]}
                  alt={gameTitle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Thumbnails Row */}
              <div className="w-full flex gap-3 overflow-x-auto no-scrollbar py-2 ">
                {mediaList.map((thumb, idx) => (
                  <button
                    key={`thumb-${idx}`}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden border transition-all shrink-0 cursor-pointer ${
                      activeMediaIndex === idx
                        ? "border-rose-500 ring-2 ring-rose-500/40 opacity-100 scale-102"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Badges Row (Genre, Rating, Launcher) */}
              <div className="w-full grid grid-cols-3 items-center justify-between sm:justify-start flex-wrap sm:flex-nowrap gap-3 sm:gap-5 pt-4">
                <div className="flex flex-col gap-1.5 min-w-0 flex-1 sm:flex-none">
                  <span className="text-body-xs text-gray-400">
                    GENRE
                  </span>
                  <div className="relative w-full overflow-hidden">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth pr-6 py-0.5">
                      {gameGenres.map((g) => (
                        <Pill
                          key={g}
                          variant="secondary"
                          size="xs"
                          className="px-2.5 sm:px-3 shrink-0 whitespace-nowrap"
                        >
                          {g}
                        </Pill>
                      ))}
                    </div>
                    {/* Shadow at the right of content when having > 2 genres */}
                    {gameGenres.length > 2 && (
                      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-deep-blue-950 via-deep-blue-950/70 to-transparent" />
                    )}
                  </div>
                </div>

                {/* Divider 1: Hidden on mobile, visible on desktop */}
                {/* <div className="hidden sm:block h-8 w-px bg-surface-secondary-hover shrink-0" /> */}
                <div className="flex border-x-gradient-secondary justify-center">
                <div className="flex flex-col gap-1.5 shrink-0 ">

                  <span className="text-body-xs text-gray-400">
                    RATING
                  </span>
                  <div className="flex items-center gap-3 sm:gap-2">
                    <span className="text-body-sm font-semibold text-white">4.0</span>
                    <div className="flex items-center gap-1 text-white">
                      <StarFilledIcon className="w-4 h-4 fill-current text-white shrink-0" />
                      <StarFilledIcon className="w-4 h-4 fill-current text-white shrink-0" />
                      <StarFilledIcon className="w-4 h-4 fill-current text-white shrink-0" />
                      <StarFilledIcon className="w-4 h-4 fill-current text-white shrink-0" />
                      <StarRegularIcon className="w-4 h-4 fill-current text-gray-500 shrink-0" />
                    </div>
                  </div>
                </div>
                </div>

                {/* Divider 2: Hidden on mobile, visible on desktop */}
                {/* <div className="hidden sm:block h-8 w-px bg-surface-secondary-hover shrink-0" /> */}

                <div className="flex flex-col gap-1.5 shrink-0">
                  <span className="text-body-xs text-gray-400">
                    LAUNCHER
                  </span>
                  <span className="text-body-sm font-semibold text-gray-50">
                    Steam
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Price, Action, & Account Credentials Card (5 cols) */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-8xl pb-12 border-b-gradient-secondary">
                <div className="grid gap-8">
                  <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                    <SteamIcon className="w-4 h-4 text-white" />
                    <span className="text-white">Steam</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-h3 font-semibold text-white">
                    {gameTitle}
                  </h1>

                  {/* Description */}
                  <p className="text-body-sm text-gray-400">
                    {gameDescription}
                  </p>
                </div>

                {/* Price Row */}
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 px-2">
                    <span className="text-body-md text-gray-400 line-through">
                      {(matchedProduct as { originalPrice?: string })?.originalPrice || "Rp 439.000,00"}
                    </span>
                    <span className="text-h4 font-semibold text-white">
                      {(matchedProduct as { price?: string })?.price || "Rp 219.500"}
                    </span>
                  </div>
                  <Pill variant="primary" size="sm">
                    {(matchedProduct as { discount?: string })?.discount || "-30%"}
                  </Pill>
                </div>
              </div>

              {/* Action Button: Lihat di Launcher */}
              <Button
                variant="outline"
                size="sm"
                className="w-full py-3"
                onClick={() => {
                  window.open("https://store.steampowered.com/about/", "_blank");
                }}
              >
                Lihat di Launcher
              </Button>

              {/* ===================================================================
                  INFORMASI AKUN GAME CARD (Figma Image 1 Reference)
                  =================================================================== */}
              <div className="w-full rounded-lg bg-deep-blue-900 p-5 mt-5 flex flex-col gap-4 shadow-xl">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-deep-blue-800 border border-deep-blue-700 p-3 flex items-center justify-center text-deep-blue-100 shrink-0">
                    <DefaultPeopleSearchIcon />
                  </div>
                  <span className="font-semibold text-gray-50 text-body-lg">
                    Informasi Akun Game
                  </span>
                </div>

                {/* Pre-order Notice Pill (shown when game is still pre-order) */}
                {isPreorder && (
                  <div className="flex justify-center w-full py-0.5">
                    <Pill
                      variant="warning"
                      size="sm"
                      className="bg-[#2B1B10] text-amber-600 border border-amber-900/40 font-medium px-4 py-1.5 rounded-full text-label-xs tracking-normal"
                    >
                      Game ini Pre-order Silahkan Tunggu Rilis
                    </Pill>
                  </div>
                )}

                {/* Unified Credentials Box */}
                <div className="w-full rounded-lg border-gradient-secondary">
                  {/* Username Row */}
                  <div className="mx-4 py-3 flex items-center justify-between border-b-gradient-secondary">
                    <div className="flex items-center">
                      <span className="text-gray-400 text-body-xs">Username :</span>
                      <span className="font-mono text-sm text-white ml-2">
                        {isPreorder ? "-" : (showUsername ? accountUsername : "*********")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        disabled={isPreorder}
                        onClick={() => !isPreorder && setShowUsername(!showUsername)}
                        className={cn(
                          "p-1 text-gray-400 transition-colors border-gradient-secondary",
                          isPreorder
                            ? "opacity-40 cursor-not-allowed text-gray-500"
                            : "hover:text-white cursor-pointer"
                        )}
                        title={isPreorder ? "Belum tersedia" : (showUsername ? "Sembunyikan" : "Tampilkan")}
                      >
                        {showUsername && !isPreorder ? (
                          <EyeOffIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        disabled={isPreorder}
                        onClick={() => !isPreorder && handleCopy(accountUsername, "Username")}
                        className={cn(
                          "p-1 text-gray-400 transition-colors",
                          isPreorder
                            ? "opacity-40 cursor-not-allowed text-gray-500"
                            : "hover:text-white cursor-pointer"
                        )}
                        title={isPreorder ? "Belum tersedia" : "Salin Username"}
                      >
                        <CopyIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Password Row */}
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-400 text-body-xs">Password :</span>
                      <span className="font-mono text-sm text-white ml-2">
                        {isPreorder ? "-" : (showPassword ? accountPassword : "**********")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        disabled={isPreorder}
                        onClick={() => !isPreorder && setShowPassword(!showPassword)}
                        className={cn(
                          "p-1 text-gray-400 transition-colors border-gradient-secondary",
                          isPreorder
                            ? "opacity-40 cursor-not-allowed text-gray-500"
                            : "hover:text-white cursor-pointer"
                        )}
                        title={isPreorder ? "Belum tersedia" : (showPassword ? "Sembunyikan" : "Tampilkan")}
                      >
                        {showPassword && !isPreorder ? (
                          <EyeOffIcon className="w-4 h-4" />
                        ) : (
                          <EyeIcon className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        disabled={isPreorder}
                        onClick={() => !isPreorder && handleCopy(accountPassword, "Password")}
                        className={cn(
                          "p-1 text-gray-400 transition-colors",
                          isPreorder
                            ? "opacity-40 cursor-not-allowed text-gray-500"
                            : "hover:text-white cursor-pointer"
                        )}
                        title={isPreorder ? "Belum tersedia" : "Salin Password"}
                      >
                        <CopyIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right-aligned Hubungi Admin Button */}
                <div className="flex justify-end pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.open(
                        `https://wa.me/6281234567890?text=Halo%20Admin%20Gamezygo,%20saya%20butuh%20bantuan%20akun%20untuk%20game%20${encodeURIComponent(
                          gameTitle
                        )}`,
                        "_blank"
                      );
                    }}
                  >
                    <PhoneIcon className="w-3.5 h-3.5 text-gray-300" />
                    <span>Hubungi Admin</span>
                  </Button>
                </div>
              </div>
              </div>
          </section>

          {/* =========================================================================
              C. DETAIL SPESIFIKASI (MINIMUM & REKOMENDASI)
              ========================================================================= */}
          <section className="w-full flex flex-col gap-6 pt-4">
            <h2 className="text-h3 font-semibold text-gray-100">
              Detail Spesifikasi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: MINIMUM */}
              <div className="w-full rounded-xl bg-deep-blue-900 border border-white/10 p-6 flex flex-col gap-4">
                <span className="text-body-md font-semibold text-gray-50  uppercase">
                  MINIMUM
                </span>

                <div className="flex flex-col gap-6 text-body-sm ">
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">OS</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{minSpecs.os}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">CPU</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{minSpecs.cpu}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">RAM</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{minSpecs.ram}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">GPU</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{minSpecs.gpu}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">DirectX</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{minSpecs.directx}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">Storage</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{minSpecs.storage}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">Sound Card</span>
                    <span className="text-body-sm text-gray-100 font-semibold">
                      {minSpecs.soundCard || "DX Compatible"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: REKOMENDASI */}
              <div className="w-full rounded-xl bg-deep-blue-900 border border-white/10 p-6 flex flex-col gap-4">
                <span className="text-body-md font-semibold text-gray-50  uppercase">
                  REKOMENDASI
                </span>

                <div className="flex flex-col gap-6 text-body-sm">
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">OS</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{recSpecs.os}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">CPU</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{recSpecs.cpu}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">RAM</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{recSpecs.ram}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">GPU</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{recSpecs.gpu}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">DirectX</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{recSpecs.directx}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">Storage</span>
                    <span className="text-body-sm text-gray-100 font-semibold">{recSpecs.storage}</span>
                  </div>
                  <div className="flex flex-col gap-2 ">
                    <span className="text-body-xs text-gray-400">Sound Card</span>
                    <span className="text-body-sm text-gray-100 font-semibold">
                      {recSpecs.soundCard || "DX Compatible"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              D. PANDUAN MENGUNDUH (4 STEP GUIDE)
              ========================================================================= */}
          <section className="w-full flex flex-col gap-6 pt-4">
            <h2 className="text-h3 font-semibold text-gray-100">
              Panduan Mengunduh
            </h2>

            <div className="w-full rounded-xl bg-deep-blue-900 border border-white/10 p-6 sm:p-8 flex flex-col gap-6">
            <div className="grid gap-6 pl-6 border-l-gradient-primary">
              {/* Step 1 */}
              <div className="grid gap-2 pl-2 border-b-gradient-secondary pb-6">
                <span className="text-body-xs text-gray-400 uppercase">
                  LANGKAH 1
                </span>
                <h3 className="text-body-md font-semibold text-gray-100">
                  Buka launcher Steam atau unduh di Gamezygo
                </h3>
                <p className="text-body-sm text-gray-400">
                  Buka katalog pembelian Anda di Gamezygo lalu klik &apos;Unduh Game&apos; atau buka launcher Steam resmi di PC Anda.
                </p>
              </div>

              {/* Step 2 */}
              <div className="grid gap-2 pl-2 border-b-gradient-secondary pb-6">
               <span className="text-body-xs text-gray-400 uppercase">
                  LANGKAH 2
                </span>
                <h3 className="text-body-md font-semibold text-gray-100">
                  Masukkan Akun yang telah diberikan
                </h3>
                <p className="text-body-sm text-gray-400">
                  Salin dan tempel Username serta Password akun game yang tertera pada kotak &apos;Informasi Akun Game&apos; di atas.
                </p>
              </div>

              {/* Step 3 */}
              <div className="grid gap-2 pl-2 border-b-gradient-secondary pb-6">
               <span className="text-body-xs text-gray-400 uppercase">
                  LANGKAH 3
                </span>
                <h3 className="text-body-md font-semibold text-gray-100">
                  Masuk ke library dan install game
                </h3>
                <p className="text-body-sm text-gray-400">
                  Setelah berhasil login ke Steam, buka tab Library, temukan game ini dan klik &apos;Install&apos; lalu tunggu hingga proses unduhan selesai.
                </p>
              </div>

              {/* Step 4 */}
              <div className="grid gap-2 pl-2 border-b-gradient-secondary pb-6">
               <span className="text-body-xs text-gray-400 uppercase">
                  LANGKAH 4
                </span>
                <h3 className="text-body-md font-semibold text-gray-100">
                  Login Steam &gt; Aktifkan Steam Mode Offline &gt; Mainkan Game Offline
                </h3>
                <p className="text-body-sm text-gray-400">
                  Penting: Sebelum bermain, ubah status Steam ke &apos;Go Offline&apos; melalui menu Steam &gt; Go Offline agar akun tidak bentrok dengan pengguna lain.
                </p>
              </div>
            </div>
            </div>
          </section>

          {/* =========================================================================
              E. TESTIMONIAL SECTION (MATCHING SCREENSHOT 4 & SLIDER)
              ========================================================================= */}
          <section className="w-full flex flex-col gap-13 pt-4">
            {/* Testimonial Header with Red Accent Bar */}
            <div className="border-l-4 border-l-gradient-primary pl-8 pb-6 flex flex-col gap-8">
              <div className="grid gap-3">
              <span className="text-body-sm text-gray-400 uppercase">
                TESTIMONIAL
              </span>
              <h2 className="text-h3 sm:text-h2 font-semibold text-gradient-heading w-fit">
                Dengarkan Pendapat Gamer <br /> Setelah Beli di Gamezygo!
              </h2>
            </div>

            {/* "Beri Pendapat" Input Bar */}
            <div className="relative w-full sm:max-w-1/2">
              <div className="w-full flex items-center bg-deep-blue-900 border border-white/10 rounded-xl px-4 py-3 gap-3 focus-within:border-white/30 transition-all">
                <span className="text-gray-400 text-body-sm font-semibold">@</span>
                <input
                  type="text"
                  value={opinionInput}
                  onChange={(e) => setOpinionInput(e.target.value)}
                  placeholder="Beri pendapat"
                  className="w-full bg-transparent text-body-sm text-gray-100 placeholder:text-gray-500 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && opinionInput.trim()) {
                      setToastMessage("Terima kasih atas pendapat Anda!");
                      setOpinionInput("");
                      setTimeout(() => setToastMessage(null), 3000);
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (opinionInput.trim()) {
                      setToastMessage("Terima kasih atas pendapat Anda!");
                      setOpinionInput("");
                      setTimeout(() => setToastMessage(null), 3000);
                    }
                  }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
            </div>

            {/* Infinite Moving Testimonial Cards Carousel (matching blogs/[id].tsx) */}
            <div className="relative w-full overflow-hidden pt-2 sm:pt-4 pb-6 sm:pb-8">
              {/* Vignette gradient masks on sides */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-r from-deep-blue-950 to-transparent z-10 hidden sm:block" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-linear-to-l from-deep-blue-950 to-transparent z-10 hidden sm:block" />

              {/* Moving Track */}
              <div className="flex gap-6 w-max animate-infinite-carousel hover:[animation-play-state:paused] items-stretch py-2">
                {infiniteTestimonials.map((t, idx) => (
                  <div
                    key={`${t.id}-${idx}`}
                    className="w-80 sm:w-96 shrink-0 transition-transform duration-300 hover:scale-[1.01]"
                  >
                    <TestimonialCard
                      avatarSrc={t.avatarSrc}
                      userName={t.userName}
                      gameName={t.gameName}
                      rating={t.rating}
                      review={t.review}
                      images={t.images}
                      className="h-full bg-deep-blue-900 border border-white/10 flex flex-col justify-between"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Global Floating Toast */}
        {toastMessage && (
          <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-50 md:w-auto md:min-w-80 md:max-w-105 animate-fade-in">
            <Toast
              variant="success"
              title="Berhasil"
              description={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}
      </StoreLayout>
    </>
  );
}
