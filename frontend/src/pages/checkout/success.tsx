import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * White Shopping Cart Icon matching user's design
 */
const CartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 sm:w-9 sm:h-9 text-white shrink-0"
    {...props}
  >
    <path
      d="M3 4H5.2L6.8 14C6.9 14.6 7.2 15.1 7.7 15.5C8.2 15.9 8.8 16.1 9.4 16H18.2C18.8 16.1 19.4 15.9 19.9 15.5C20.4 15.1 20.7 14.6 20.8 14L22 7H5.8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="19.5" r="1.5" stroke="currentColor" strokeWidth="2" />
    <circle cx="18" cy="19.5" r="1.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

/**
 * Chain Link Icon for "Game Library" button
 */
const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-gray-300 shrink-0"
    {...props}
  >
    <path
      d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Dismiss / Close (X) Icon
 */
const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors"
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

export default function CheckoutSuccessPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/library");
  };

  return (
    <>
      <Head>
        <title>Transaksi Berhasil - Gamezygo</title>
        <meta
          name="description"
          content="Transaksi Anda berhasil! Game telah ditambahkan ke Game Library Anda."
        />
      </Head>

      <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-deep-blue-950 text-gray-50 antialiased selection:bg-rose-600/30 selection:text-white">
        {/* Main Success Card matching the design */}
        <div className="w-full max-w-[460px] bg-[#0c1019] sm:bg-[#111520]/95 border border-white/10 rounded-lg p-6 sm:p-7 backdrop-blur-xl  flex flex-col transition-all">
          {/* Card Header: "Transaksi Berhasil" + Close Button */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10 w-full">
            <h1 className="text-white text-base sm:text-[17px] font-semibold tracking-normal">
              Transaksi Berhasil
            </h1>
            <button
              type="button"
              onClick={handleClose}
              className="group p-1 rounded-md hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-white/20"
              aria-label="Tutup dan Buka Library"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Card Body: Shopping Cart Icon + Titles + Game Library Button */}
          <div className="flex flex-col items-center justify-center pt-10 pb-4 text-center w-full">
            {/* Dark Rounded Square Container for Cart Icon */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-lg bg-[#171b26] border border-white/5 flex items-center justify-center mb-6  shrink-0">
              <CartIcon />
            </div>

            {/* Main Heading */}
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
              Game Berhasil Ditambahkan
            </h2>

            {/* Subtitle / Description */}
            <p className="text-xs sm:text-sm text-gray-400 font-normal leading-relaxed mb-7 ">
              Game sudah masuk di Game Library kamu!
              <br />
              Selamat Bermain
            </p>

            {/* Button: "Game Library" */}
            <Link
              href="/library"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-lg bg-[#181d29] hover:bg-[#23293a] border border-white/10 hover:border-white/20 text-white text-sm font-medium transition-all duration-150 cursor-pointer  hover:scale-[1.02] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            >
              <LinkIcon />
              <span>Game Library</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
