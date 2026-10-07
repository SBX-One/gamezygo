import * as React from "react";
import { useRouter } from "next/router";

export default function DashboardIndexPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/library");
  }, [router]);

  return null;
}
