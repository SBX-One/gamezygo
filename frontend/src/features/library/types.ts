export interface GameCredentials {
  username?: string;
  password?: string;
  access_token?: string;
  steam_guard?: string;
}

export interface CredentialRevealerProps {
  /** Nama judul game */
  gameTitle: string;
  /** Username akun game (terdekripsi) */
  username?: string;
  /** Password akun game (terdekripsi) */
  password?: string;
  /** Access Token / Steam Guard (jika ada) */
  accessToken?: string;
  /** Apakah game ini masih pre-order (kredensial terkunci) */
  isPreorder?: boolean;
  /** Status pemuatan data kredensial */
  isLoading?: boolean;
  /** Nomor kontak support WhatsApp (default: Gamezygo Admin) */
  supportPhone?: string;
  /** Callback opsional saat teks disalin */
  onCopySuccess?: (field: string) => void;
  /** Kelas CSS tambahan */
  className?: string;
}

export interface LibraryGameItem {
  id: string | number;
  slug?: string;
  title: string;
  imageSrc: string;
  genres: string[];
  platform?: string;
  launcher?: string;
  isPreorder?: boolean;
  purchaseDate?: string;
}
