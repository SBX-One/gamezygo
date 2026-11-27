import * as React from "react";
import Head from "next/head";
import { EmptyState } from "@/components/ui/EmptyState";
import { FluentWifiFilledIcon } from "@/components/shared/Error500View";

export default function Custom500Page() {
  return (
    <>
      <Head>
        <title>500: Internal Server Error | Gamezygo</title>
        <meta
          name="description"
          content="Terjadi kesalahan pada server. Halaman tidak dapat dimuat."
        />
      </Head>
      <div className="w-full min-h-screen bg-deep-blue-950 flex items-center justify-center p-4">
        <EmptyState
          icon={<FluentWifiFilledIcon className="w-8 h-8 text-gray-50" />}
          title="500: Internal Server Error"
          description="Terjadi kesalahan pada server. Halaman sedang tidak dapat dimuat. Silakan coba beberapa saat lagi."
          backLabel=""
          searchLabel="Muat Ulang"
          onSearch={() => window.location.reload()}
        />
      </div>
    </>
  );
}
