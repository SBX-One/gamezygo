import * as React from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthRouteGuard } from "@/components/shared/AuthRouteGuard";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  // Stable QueryClient instance for Pages router
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className={`${inter.variable} font-sans antialiased`}>
        <AuthRouteGuard>
          <Component {...pageProps} />
        </AuthRouteGuard>
      </div>
    </QueryClientProvider>
  );
}


