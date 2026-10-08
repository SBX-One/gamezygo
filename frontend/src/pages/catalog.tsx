import { useEffect } from "react";
import { useRouter } from "next/router";

export default function CatalogRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/store");
  }, [router]);

  return null;
}
