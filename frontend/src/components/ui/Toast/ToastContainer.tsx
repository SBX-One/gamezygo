import * as React from "react";
import { useToastStore } from "@/stores/use-toast-store";
import { Toast } from "./Toast";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-[380px] w-full pointer-events-none"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto transition-all animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <Toast
            title={item.title}
            description={item.description}
            variant={item.variant}
            onClose={() => removeToast(item.id)}
          />
        </div>
      ))}
    </div>
  );
}
