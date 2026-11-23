import * as React from "react";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/bundle",
      permanent: true,
    },
  };
};

export default function SubscriptionRedirectPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/bundle");
  }, [router]);

  return null;
}
