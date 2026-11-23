export interface SpecItem {
  id: string;
  label: string;
  value: string;
}

export interface InstructionStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface InstructionTemplateItem {
  id: string;
  title: string;
  badge: string;
  createdAt: string;
  lastEdit: string;
  steps: InstructionStep[];
}

export interface AdminAddProductFormData {
  name: string;
  finalPrice: string;
  initialPrice: string;
  isPreOrder: boolean;
  genres: string[];
  imageSrc: string;
  imageFile?: File | null;
  launcher: "Steam" | "Epic Games" | "EA" | "PS4";
  promotionSection: string;
  storeUrl: string;
  accountUsername: string;
  accountPassword: string;
  minimumSpecs: SpecItem[];
  recommendationSpecs: SpecItem[];
  hasInstructionTemplate: boolean;
  selectedTemplate: InstructionTemplateItem | null;
}

export const DEFAULT_INSTRUCTION_TEMPLATES: InstructionTemplateItem[] = [
  {
    id: "tpl-1",
    title: "Panduan Download Game",
    badge: "Listed",
    createdAt: "22/07/2026",
    lastEdit: "Last edit 7 days ago",
    steps: [
      {
        stepNumber: 1,
        title: "Cari Monster Hunter Stories di katalog Gamezygo.",
        description:
          "Buka /katalog Playfast atau ketik nama game di kolom pencarian, lalu pilih Monster Hunter Stories.",
      },
      {
        stepNumber: 2,
        title: "Beli satuan atau subscribe Premium.",
        description:
          "Beli akses Monster Hunter Stories satu kali (lifetime access) atau aktifkan Playfast Premium untuk akses semua game di katalog.",
      },
      {
        stepNumber: 3,
        title: "Terima kredensial akun secara instan.",
        description:
          "Setelah pembayaran dikonfirmasi, kamu akan menerima username, password, dan kode Steam Guard otomatis di akun Gamezygo kamu.",
      },
      {
        stepNumber: 4,
        title: "Login Steam → download → offline mode → main Monster Hunter Stories.",
        description:
          "Login ke Steam dengan kredensial yang diberikan, download game-nya, masuk Steam → Go Offline, dan langsung main tanpa gangguan.",
      },
    ],
  },
  {
    id: "tpl-2",
    title: "Panduan Download Game",
    badge: "Listed",
    createdAt: "22/07/2026",
    lastEdit: "Last edit 7 days ago",
    steps: [
      {
        stepNumber: 1,
        title: "Cari game di katalog Gamezygo.",
        description: "Buka katalog atau ketik nama game di kolom pencarian.",
      },
      {
        stepNumber: 2,
        title: "Selesaikan pembayaran.",
        description:
          "Pilih metode pembayaran yang tersedia dan selesaikan transaksi.",
      },
      {
        stepNumber: 3,
        title: "Dapatkan akun game.",
        description:
          "Kredensial akun akan langsung muncul di library akun Gamezygo kamu.",
      },
      {
        stepNumber: 4,
        title: "Login ke launcher dan mainkan.",
        description:
          "Gunakan data akun untuk login ke platform launcher yang sesuai.",
      },
    ],
  },
  {
    id: "tpl-3",
    title: "Panduan Download Game",
    badge: "Listed",
    createdAt: "22/07/2026",
    lastEdit: "Last edit 7 days ago",
    steps: [
      {
        stepNumber: 1,
        title: "Download launcher resmi game.",
        description: "Pastikan client launcher terpasang di perangkat Anda.",
      },
      {
        stepNumber: 2,
        title: "Gunakan akun yang diberikan.",
        description: "Login dengan username dan password dari detail pesanan.",
      },
      {
        stepNumber: 3,
        title: "Download game ke PC.",
        description: "Mulai unduh seluruh file game sampai selesai.",
      },
      {
        stepNumber: 4,
        title: "Aktifkan offline mode.",
        description: "Masuk ke mode offline agar bermain lancar tanpa kendala.",
      },
    ],
  },
];

export const DEFAULT_ADD_PRODUCT_FORM: AdminAddProductFormData = {
  name: "",
  finalPrice: "",
  initialPrice: "",
  isPreOrder: false,
  genres: [],
  imageSrc: "",
  launcher: "Steam",
  promotionSection: "",
  storeUrl: "",
  accountUsername: "Username_test",
  accountPassword: "Password@123",
  minimumSpecs: [
    {
      id: "spec-1",
      label: "OS version",
      value: "Windows® 10 (64-bit)",
    },
    {
      id: "spec-2",
      label: "CPU",
      value: "Intel® Core™ i7-7700 (quad-core) / AMD® Ryzen™ 5 1600 (hexa-core)",
    },
    {
      id: "spec-3",
      label: "Additional Space",
      value: "SSD recommended",
    },
  ],
  recommendationSpecs: [
    {
      id: "spec-rec-1",
      label: "OS version",
      value: "Windows® 10 (64-bit)",
    },
    {
      id: "spec-rec-2",
      label: "CPU",
      value: "Intel® Core™ i7-7700 (quad-core) / AMD® Ryzen™ 5 1600 (hexa-core)",
    },
    {
      id: "spec-rec-3",
      label: "Additional Space",
      value: "SSD recommended",
    },
  ],
  hasInstructionTemplate: true,
  selectedTemplate: DEFAULT_INSTRUCTION_TEMPLATES[0],
};

export const MOCK_EDIT_PRODUCT_FORM: AdminAddProductFormData = {
  name: "Beholder : Conductor",
  finalPrice: "150000",
  initialPrice: "250000",
  isPreOrder: false,
  genres: ["Action", "Adventure"],
  imageSrc:
    "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2825530/library_600x900_2x.jpg",
  launcher: "Steam",
  promotionSection: "",
  storeUrl: "https://www.instagram.com/sbxonestudio/",
  accountUsername: "Username_test",
  accountPassword: "Password@123",
  minimumSpecs: [
    {
      id: "spec-min-1",
      label: "OS version",
      value: "Windows® 10 (64-bit)",
    },
    {
      id: "spec-min-2",
      label: "CPU",
      value: "Intel® Core™ i7-7700 (quad-core) / AMD® Ryzen™ 5 1600 (hexa-core)",
    },
    {
      id: "spec-min-3",
      label: "CPU",
      value: "Intel® Core™ i7-7700 (quad-core) / AMD® Ryzen™ 5 1600 (hexa-core)",
    },
    {
      id: "spec-min-4",
      label: "CPU",
      value: "Intel® Core™ i7-7700 (quad-core) / AMD® Ryzen™ 5 1600 (hexa-core)",
    },
  ],
  recommendationSpecs: [
    {
      id: "spec-rec-1",
      label: "OS version",
      value: "Windows® 10 (64-bit)",
    },
    {
      id: "spec-rec-2",
      label: "CPU",
      value: "Intel® Core™ i7-7700 (quad-core) / AMD® Ryzen™ 5 1600 (hexa-core)",
    },
    {
      id: "spec-rec-3",
      label: "CPU",
      value: "Intel® Core™ i7-7700 (quad-core) / AMD® Ryzen™ 5 1600 (hexa-core)",
    },
    {
      id: "spec-rec-4",
      label: "CPU",
      value: "Intel® Core™ i7-7700 (quad-core) / AMD® Ryzen™ 5 1600 (hexa-core)",
    },
  ],
  hasInstructionTemplate: true,
  selectedTemplate: DEFAULT_INSTRUCTION_TEMPLATES[0],
};

export const GENRE_CHOICES = [
  "Action",
  "Adventure",
  "Sport-Racing",
  "Fighting",
  "NSFW",
  "Fantasy",
  "RPG",
  "Horror",
  "Multiplayer",
  "Romance",
  "Comedy",
  "Casual",
] as const;

export const LAUNCHER_CHOICES = [
  "Steam",
  "Epic Games",
  "EA",
  "PS4",
] as const;

export const PROMOTION_SECTION_OPTIONS = [
  { label: "Pilih section", value: "" },
  { label: "Hot Deals", value: "hot_deals" },
  { label: "Best Seller", value: "best_seller" },
  { label: "New Release", value: "new_release" },
  { label: "Coming Soon", value: "coming_soon" },
  { label: "Featured Promo", value: "featured" },
];
