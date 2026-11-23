import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminVoucherRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/vouchers");
  }, [router]);

  return null;
}
