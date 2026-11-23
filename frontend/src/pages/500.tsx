import * as React from "react";
import Head from "next/head";
import { Error500View } from "@/components/shared/Error500View";

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
        <Error500View showBackButton={false} />
      </div>
    </>
  );
}
