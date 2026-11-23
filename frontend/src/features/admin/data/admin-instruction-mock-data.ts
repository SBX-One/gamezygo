import type { InstructionTemplate } from "../types/admin-instruction.types";

export const MOCK_ADMIN_INSTRUCTION_TEMPLATES: InstructionTemplate[] = [
  {
    id: "inst-1",
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
          "Beli akses Monster Hunter Stories satu kali (lifetime access) atau aktifkan Playfast Premium mulai Rp 50.000/bulan untuk akses semua game di katalog.",
      },
      {
        stepNumber: 3,
        title: "Terima kredensial akun secara instan.",
        description:
          "Setelah pembayaran dikonfirmasi, kamu akan menerima username, password, dan kode Steam Guard otomatis di akun Gamezygo kamu.",
      },
      {
        stepNumber: 4,
        title:
          "Login Steam → download → offline mode → main Monster Hunter Stories.",
        description:
          "Login ke Steam dengan kredensial yang diberikan, download game-nya, masuk Steam → Go Offline, dan langsung main tanpa gangguan.",
      },
    ],
  },
  {
    id: "inst-2",
    title: "Panduan Download Game",
    badge: "Listed",
    createdAt: "22/07/2026",
    lastEdit: "Last edit 7 days ago",
    steps: [
      {
        stepNumber: 1,
        title: "Buka client launcher resmi.",
        description:
          "Pastikan aplikasi launcher (Steam, Epic, atau EA) sudah terpasang dan dalam kondisi update terbaru.",
      },
      {
        stepNumber: 2,
        title: "Masukkan akun shared yang diberikan.",
        description:
          "Salin username dan password dari brankas library pesanan akun Gamezygo Anda.",
      },
      {
        stepNumber: 3,
        title: "Download game dan verifikasi instalasi.",
        description:
          "Lakukan download hingga selesai 100% dan luncurkan game sekali untuk instalasi file pendukung.",
      },
      {
        stepNumber: 4,
        title: "Beralih ke mode offline.",
        description:
          "Pilih menu Go Offline pada launcher agar bermain lancar tanpa terputus akun lain.",
      },
    ],
  },
  {
    id: "inst-3",
    title: "Panduan Download Game",
    badge: "Listed",
    createdAt: "22/07/2026",
    lastEdit: "Last edit 7 days ago",
    steps: [
      {
        stepNumber: 1,
        title: "Masuk ke akun customer Gamezygo.",
        description:
          "Kunjungi menu Library Saya untuk melihat daftar game yang sudah berhasil Anda beli.",
      },
      {
        stepNumber: 2,
        title: "Dapatkan kredensial dan Steam Guard token.",
        description:
          "Klik tombol Buka Kredensial untuk melihat detail login akun bersama.",
      },
      {
        stepNumber: 3,
        title: "Install game pada direktori penyimpanan PC.",
        description:
          "Pilih disk drive yang memiliki kapasitas memori cukup untuk mengunduh game.",
      },
      {
        stepNumber: 4,
        title: "Mainkan dalam Offline Mode.",
        description:
          "Selesai download, ubah status client ke offline mode dan nikmati permainan Anda.",
      },
    ],
  },
];
