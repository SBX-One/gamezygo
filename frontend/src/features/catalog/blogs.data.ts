export interface GuideEntry {
  name: string;
  keyMove?: string;
  paragraphs: string[];
}

export interface BlogItem {
  id: string;
  imageSrc: string;
  bannerSrc?: string;
  date: string;
  fullDate?: string;
  title: string;
  category: string;
  description: string;
  status?: string;
  platform?: string;
  game?: string;
  intro1?: string;
  intro2?: string;
  guideTitle?: string;
  guideEntries?: GuideEntry[];
}

export const CATEGORIES = [
  "Berita & Pembaruan",
  "Panduan Bermain",
  "Tutorial",
  "Review & Rekomendasi",
];

export const STATUS_OPTIONS = ["Hot Deals", "New Release", "Coming Soon", "Action"];
export const PLATFORM_OPTIONS = ["Steam", "Epic Games", "Play Station"];
export const GAME_OPTIONS = ["Elden Ring", "Cyberpunk", "GTA 6"];
export const SORT_OPTIONS = ["Terbaru", "Nama (A - Z)"];

export interface PromoGameItem {
  id: string;
  title: string;
  imageSrc: string;
  fallbackSrc: string;
}

export const PROMO_GAMES: PromoGameItem[] = [
  {
    id: "promo-1",
    title: "Assassin's Creed Black Flag Resynced",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/242050/library_600x900_2x.jpg",
    fallbackSrc:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&h=900&q=80",
  },
  {
    id: "promo-2",
    title: "Grand Theft Auto V",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    fallbackSrc:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&h=900&q=80",
  },
  {
    id: "promo-3",
    title: "EA SPORTS FC™ 26 Standard Edition",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2195250/library_600x900_2x.jpg",
    fallbackSrc:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&h=900&q=80",
  },
  {
    id: "promo-4",
    title: "Red Dead Redemption II",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    fallbackSrc:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&h=900&q=80",
  },
  {
    id: "promo-5",
    title: "Subnautica 2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1962700/library_600x900_2x.jpg",
    fallbackSrc:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&h=900&q=80",
  },
];

export const BLOGS_DATA: BlogItem[] = [
  {
    id: "blog-1",
    imageSrc:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    bannerSrc:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=85",
    date: "1 HARI LALU",
    fullDate: "1 HARI LALU, 6 SEPTEMBER 2026",
    title: "Panduan pembeli Promo Musim Panas Epic Games: Penawaran game PC terbaik.",
    category: "Berita & Pembaruan",
    description:
      "Timku yang beranggotakan empat orang tersebar di halaman merah berdebu di daerah terpencil tak bernama di Anaxes, bersembunyi di balik peti baja dan dinding beton yang membentuk desa kecil ini.",
    status: "Hot Deals",
    platform: "Epic Games",
    game: "Cyberpunk",
    intro1:
      "Promo Musim Panas Epic Games Store kembali digelar dengan diskon hingga 75% untuk berbagai judul blockbuster dan indie hits. Dapatkan kupon diskon tambahan otomatis pada setiap transaksi checkout.",
    intro2:
      "Di panduan ini, kami merangkum rekomendasi game PC terbaik yang wajib masuk wishlist Anda, mulai dari game open-world grafis memukau hingga game co-op santai bersama teman.",
    guideTitle: "Daftar Rekomendasi Game Pilihan",
    guideEntries: [
      {
        name: "1. Cyberpunk 2077: Phantom Liberty Bundle",
        keyMove: "Diskon Rekomendasi: 55%",
        paragraphs: [
          "Pengalaman RPG masa depan terbaik dengan visual ray tracing mutakhir dan cerita spionase yang mendalam di distrik Dogtown.",
          "Waktu terbaik untuk membeli paket bundle ini karena performa pada patch terbaru sudah sangat stabil dengan dukungan penuh FSR 3 dan DLSS.",
        ],
      },
      {
        name: "2. Alan Wake 2 Deluxe Edition",
        keyMove: "Diskon Rekomendasi: 50%",
        paragraphs: [
          "Karya masterpiece psychological survival horror dari Remedy Entertainment yang menyuguhkan visual sinematik tanpa tanding.",
          "Edisi Deluxe sudah mencakup expansion pack Night Springs dan Lake House yang memperluas misteri Remedy Connected Universe.",
        ],
      },
      {
        name: "3. Red Dead Redemption II",
        keyMove: "Diskon Rekomendasi: 67%",
        paragraphs: [
          "Kisah legendaris Arthur Morgan dan geng Van der Linde di era koboi liar Amerika yang masih menjadi tolak ukur open-world gaming.",
          "Dengan harga promo terbaik tahun ini, game ini merupakan investasi wajib bagi penggemar cerita naratif yang emosional.",
        ],
      },
    ],
  },
  {
    id: "blog-2",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
    bannerSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg",
    date: "2 MINGGU LALU",
    fullDate: "14 HARI LALU, 23 JULI 2026",
    title: "Marvel Tokon: Fighting Souls character guide - tips for every hero and villain.",
    category: "Panduan Bermain",
    description:
      "Timku yang beranggotakan empat orang tersebar di halaman merah berdebu di daerah terpencil tak bernama di Anaxes, bersembunyi di balik peti baja dan dinding beton yang membentuk desa kecil ini.",
    status: "New Release",
    platform: "Steam",
    game: "Elden Ring",
    intro1:
      "Marvel Tokon: Fighting Souls adalah game fighting tag-team terbaru yang menggabungkan roster legendaris pahlawan dan penjahat Marvel ke dalam arena pertarungan intensif dengan animasi kelas atas dan mekanik combo yang dalam namun tetap ramah bagi pemula.",
    intro2:
      "Dalam panduan karakter komprehensif ini, kami membedah setiap hero dan villain utama, moveset andalan, peran sinergi tim, serta taktik terbaik untuk mendominasi pertandingan baik di ranked match maupun mode kasual bersama teman.",
    guideTitle: "The Marvel Tokon Roster Guide",
    guideEntries: [
      {
        name: "1. Captain America (leader):",
        keyMove: "Key Move: Trick Shield (R1)",
        paragraphs: [
          "The all-American hero is made for beginner players, as his mixture of powerful strikes, anti-air uppercuts, and projectiles make him a well-rounded choice. Trick Shield offers a bit of versatility, as the strange trajectory of the shield's movement, as well as the ability to deflect it back at the opponent when it returns, create a tough guessing game for the opponent to figure out.",
        ],
      },
      {
        name: "2. Captain America (leader):",
        keyMove: "Key Move: Trick Shield (R1)",
        paragraphs: [
          "The all-American hero is made for beginner players, as his mixture of powerful strikes, anti-air uppercuts, and projectiles make him a well-rounded choice. Trick Shield offers a bit of versatility, as the strange trajectory of the shield's movement, as well as the ability to deflect it back at the opponent when it returns, create a tough guessing game for the opponent to figure out.",
        ],
      },
      {
        name: "3. Captain America (leader):",
        keyMove: "Key Move: Trick Shield (R1)",
        paragraphs: [
          "The all-American hero is made for beginner players, as his mixture of powerful strikes, anti-air uppercuts, and projectiles make him a well-rounded choice. Trick Shield offers a bit of versatility, as the strange trajectory of the shield's movement, as well as the ability to deflect it back at the opponent when it returns, create a tough guessing game for the opponent to figure out.",
          "The all-American hero is made for beginner players, as his mixture of powerful strikes, anti-air uppercuts, and projectiles make him a well-rounded choice. Trick Shield offers a bit of versatility, as the strange trajectory of the shield's movement, as well as the ability to deflect it back at the opponent when it returns, create a tough guessing game for the opponent to figure out.",
        ],
      },
      {
        name: "4. Captain America (leader):",
        keyMove: "Key Move: Trick Shield (R1)",
        paragraphs: [
          "The all-American hero is made for beginner players, as his mixture of powerful strikes, anti-air uppercuts, and projectiles make him a well-rounded choice. Trick Shield offers a bit of versatility, as the strange trajectory of the shield's movement, as well as the ability to deflect it back at the opponent when it returns, create a tough guessing game for the opponent to figure out.",
        ],
      },
      {
        name: "5. Captain America (leader):",
        keyMove: "Key Move: Trick Shield (R1)",
        paragraphs: [
          "The all-American hero is made for beginner players, as his mixture of powerful strikes, anti-air uppercuts, and projectiles make him a well-rounded choice. Trick Shield offers a bit of versatility, as the strange trajectory of the shield's movement, as well as the ability to deflect it back at the opponent when it returns, create a tough guessing game for the opponent to figure out.",
          "The all-American hero is made for beginner players, as his mixture of powerful strikes, anti-air uppercuts, and projectiles make him a well-rounded choice. Trick Shield offers a bit of versatility, as the strange trajectory of the shield's movement, as well as the ability to deflect it back at the opponent when it returns, create a tough guessing game for the opponent to figure out.",
        ],
      },
    ],
  },
  {
    id: "blog-3",
    imageSrc:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    bannerSrc:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=85",
    date: "1 BULAN LALU",
    fullDate: "1 BULAN LALU, 12 AGUSTUS 2026",
    title:
      "Pratinjau langsung Star Wars Zero Company: Attack Astromech, permadeath, dan taktik Rube Goldberg yang mematikan dan memuaskan.",
    category: "Review & Rekomendasi",
    description:
      "Timku yang beranggotakan empat orang tersebar di halaman merah berdebu di daerah terpencil tak bernama di Anaxes, bersembunyi di balik peti baja dan dinding beton yang membentuk desa kecil ini.",
    status: "Coming Soon",
    platform: "Play Station",
    game: "GTA 6",
    intro1:
      "Star Wars Zero Company menghadirkan pendekatan taktis turn-based yang segar di semesta galaksi nun jauh di sana, memadukan sistem regu spesialis dan risiko permadeath nyata di setiap misi sabotase.",
    intro2:
      "Kami berkesempatan mencoba demo tertutup selama 4 jam dan menguji sinergi astromech tempur serta efek domino lingkungan yang dapat membalikkan keadaan dalam sekejap.",
    guideTitle: "Sorotan Utama Gameplay & Taktik",
    guideEntries: [
      {
        name: "1. Mekanisme Permadeath & Konsekuensi Regu",
        keyMove: "Fokus: Perencanaan Posisi Ekstrem",
        paragraphs: [
          "Kehilangan operator favorit Anda berarti mereka gugur selamanya. Pemilihan rute infiltrasi dan timing ekstraksi pesawat menjadi kunci kelangsungan hidup skuad Anda.",
        ],
      },
      {
        name: "2. Astromech Hacker: Membalikkan Senjata Kekaisaran",
        keyMove: "Fokus: Droid Remote Hacking",
        paragraphs: [
          "Astromech tempur bukan sekadar pendamping lucu; mereka dapat meretas walker AT-ST musuh dari kejauhan dan memicu ledakan berantai di markas musuh.",
        ],
      },
    ],
  },
  {
    id: "blog-4",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2379780/header.jpg",
    bannerSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2379780/header.jpg",
    date: "1 BULAN LALU",
    fullDate: "1 BULAN LALU, 2 AGUSTUS 2026",
    title: "The basics of Balatro: essential tips and strategies for your first runs.",
    category: "Panduan Bermain",
    description:
      "Timku yang beranggotakan empat orang tersebar di halaman merah berdebu di daerah terpencil tak bernama di Anaxes, bersembunyi di balik peti baja dan dinding beton yang membentuk desa kecil ini.",
    status: "Action",
    platform: "Steam",
    game: "Elden Ring",
    intro1:
      "Balatro adalah fenomena roguelike kartu poker yang luar biasa adiktif. Memahami dasar-dasar sinergi Joker dan pengelolaan ekonomi run pertama Anda adalah pembeda antara kekalahan dini dan kemenangan skor jutaan.",
    intro2:
      "Simak panduan dasar ini untuk mengetahui Joker mana yang harus diprioritaskan di babak awal Ante dan cara memanipulasi deck Anda.",
    guideTitle: "Panduan Dasar & Strategi Joker",
    guideEntries: [
      {
        name: "1. Memahami Mult vs Chip Jokers",
        keyMove: "Aturan: Flat Chips Terlebih Dahulu, Lalu X-Mult",
        paragraphs: [
          "Di Ante awal, Joker penambah chips datar jauh lebih berharga daripada pengali eksponensial. Bangun pondasi skor sebelum mencari kartu pengali besar.",
        ],
      },
      {
        name: "2. Manajemen Bunga Finansial ($25 Cap)",
        keyMove: "Aturan: Pertahankan Saldo Minimal $25",
        paragraphs: [
          "Setiap kelipatan $5 yang Anda simpan menghasilkan $1 bunga di akhir ronde (hingga batas $25). Menjaga bankroll memberi Anda kebebasan reroll kartu di Ante akhir.",
        ],
      },
    ],
  },
  {
    id: "blog-5",
    imageSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2767030/header.jpg",
    bannerSrc:
      "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2767030/header.jpg",
    date: "1 BULAN LALU",
    fullDate: "1 BULAN LALU, 25 JULI 2026",
    title: "Marvel Rivals Cyclops guide: best tips, abilities, and season 8.5 breakdown",
    category: "Panduan Bermain",
    description:
      "Timku yang beranggotakan empat orang tersebar di halaman merah berdebu di daerah terpencil tak bernama di Anaxes, bersembunyi di balik peti baja dan dinding beton yang membentuk desa kecil ini.",
    status: "New Release",
    platform: "Steam",
    game: "Cyberpunk",
    intro1:
      "Sebagai pemimpin strategis tim X-Men, Cyclops membawa disiplin tembakan jarak jauh dan kemampuan pengatur ritme pertempuran yang mematikan di Marvel Rivals.",
    intro2:
      "Panduan ini mengupas tuntas rotasi Optic Blast, positioning di dataran tinggi, dan sinergi combo ultimatenya bersama rekan satu tim.",
    guideTitle: "Panduan Kemampuan & Taktik Cyclops",
    guideEntries: [
      {
        name: "1. Rotasi Optic Blast & Manajemen Visor",
        keyMove: "Ability: Concentrated Beam Burst",
        paragraphs: [
          "Jaga jarak optimal pada garis pertahanan tengah dan manfaatkan pantulan tembakan sudut sempit untuk mencicil hero support musuh yang bersembunyi di balik perisai.",
        ],
      },
    ],
  },
  {
    id: "blog-6",
    imageSrc:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    bannerSrc:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=85",
    date: "1 BULAN LALU",
    fullDate: "1 BULAN LALU, 18 JULI 2026",
    title: "Summer Game Fest 2026: The big game reveals and more",
    category: "Tutorial",
    description:
      "Timku yang beranggotakan empat orang tersebar di halaman merah berdebu di daerah terpencil tak bernama di Anaxes, bersembunyi di balik peti baja dan dinding beton yang membentuk desa kecil ini.",
    status: "Hot Deals",
    platform: "Epic Games",
    game: "GTA 6",
    intro1:
      "Ajang Summer Game Fest 2026 membawakan kejutan besar dengan penampilan gameplay perdana dari proyek-proyek game generasi baru yang telah lama dinantikan para gamer di seluruh dunia.",
    intro2:
      "Kami merangkum semua pengumuman terbesar, tanggal rilis resmi, serta platform yang dituju untuk setiap judul utama yang dipamerkan di panggung showcase.",
    guideTitle: "Rangkuman Pengumuman Terbesar",
    guideEntries: [
      {
        name: "1. Trailer Gameplay Eksklusif & Konfirmasi Rilis",
        keyMove: "Kategori: World Premiere Showcase",
        paragraphs: [
          "Dari game aksi sci-fi hingga sekuel RPG fantasi legendaris, simak daftar lengkap game yang akan segera tersedia di katalog Gamezygo dalam beberapa bulan mendatang.",
        ],
      },
    ],
  },
  {
    id: "blog-7",
    imageSrc:
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80",
    bannerSrc:
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1600&q=85",
    date: "3 MINGGU LALU",
    fullDate: "3 MINGGU LALU, 17 AGUSTUS 2026",
    title: "Tutorial Lengkap: Setting Steam Guard & Akun Sharing Tanpa Kendala",
    category: "Tutorial",
    description:
      "Panduan praktis langkah demi langkah mengamankan akun dan bermain offline mode dengan lancar di platform Gamezygo.",
    status: "Action",
    platform: "Steam",
    game: "Elden Ring",
    intro1:
      "Bermain game melalui sistem Steam Sharing di Gamezygo sangat mudah dan cepat. Sistem bot otomatis kami siap mengirimkan kode keamanan instan tanpa harus mengantre chat admin.",
    intro2:
      "Ikuti panduan berikut agar sesi permainan offline mode Anda berjalan mulus tanpa terganggu update otomatis atau perpindahan akun Steam pribadi.",
    guideTitle: "Langkah-Langkah Praktis Aktivasi",
    guideEntries: [
      {
        name: "1. Login dan Input Kode Steam Guard Otomatis",
        keyMove: "Langkah: 1-Click Verification Vault",
        paragraphs: [
          "Buka Game Library di akun Gamezygo Anda, salin kredensial username dan password, lalu klik tombol 'Generate 2FA Code' untuk mendapatkan kode sekuriti secara real-time.",
        ],
      },
      {
        name: "2. Beralih ke Steam Offline Mode",
        keyMove: "Langkah: Steam Menu > Go Offline",
        paragraphs: [
          "Setelah proses instalasi game selesai, klik menu Steam di pojok kiri atas dan pilih 'Go Offline'. Anda sekarang siap menikmati game tanpa batasan waktu.",
        ],
      },
    ],
  },
  {
    id: "blog-8",
    imageSrc:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    bannerSrc:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1600&q=85",
    date: "5 HARI LALU",
    fullDate: "5 HARI LALU, 2 SEPTEMBER 2026",
    title: "Review Cyberpunk 2077 Update 2.0: Apakah Masih Layak Dimainkan di 2026?",
    category: "Review & Rekomendasi",
    description:
      "Eksplorasi kembali Night City dengan performa grafis generasi baru dan mekanisme pertempuran cyberware yang dirombak total.",
    status: "Hot Deals",
    platform: "Epic Games",
    game: "Cyberpunk",
    intro1:
      "Enam tahun setelah peluncuran perdananya, Cyberpunk 2077 telah bermetamorfosis menjadi salah satu game RPG aksi open-world paling mengagumkan dan memuaskan sepanjang masa.",
    intro2:
      "Dengan perombakan total pada sistem skill tree, kecerdasan buatan polisi, pertempuran kendaraan, dan ekspansi Phantom Liberty, Night City kini terasa lebih hidup dari sebelumnya.",
    guideTitle: "Analisis & Kesimpulan Review",
    guideEntries: [
      {
        name: "1. Performa Grafis Ray Tracing & Optimalisasi Modern",
        keyMove: "Skor Grafis: 9.8 / 10",
        paragraphs: [
          "Penerapan teknologi path tracing menghadirkan pencahayaan fotorealistik yang menakjubkan di setiap sudut jalanan neon basah Night City.",
        ],
      },
      {
        name: "2. Sistem Perk & Variasi Gaya Bermain",
        keyMove: "Skor Gameplay: 9.5 / 10",
        paragraphs: [
          "Pohon keahlian baru memungkinkan Anda meracik build karakter yang benar-benar unik, baik sebagai ninja pedang cyberware lincah maupun hacker mematikan dari balik bayangan.",
        ],
      },
    ],
  },
];

export function getBlogById(id?: string | string[]): BlogItem {
  if (!id) return BLOGS_DATA[1]; // default to blog-2 (Marvel Tokon)
  const queryId = Array.isArray(id) ? id[0] : id;
  const found = BLOGS_DATA.find((b) => b.id.toLowerCase() === queryId.toLowerCase());
  return found || BLOGS_DATA[1];
}
