import * as React from "react";
import { create } from "zustand";
import type { ToastVariant } from "@/components/ui/Toast/Toast";

export interface ToastOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (options) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastItem = { ...options, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    const duration = options.duration ?? 3500;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}));

export const toast = {
  show: (options: ToastOptions) => useToastStore.getState().addToast(options),
  success: (description: React.ReactNode, title = "Berhasil") =>
    useToastStore.getState().addToast({ title, description, variant: "success" }),
  error: (description: React.ReactNode, title = "Gagal") =>
    useToastStore.getState().addToast({ title, description, variant: "error" }),
  warning: (description: React.ReactNode, title = "Peringatan") =>
    useToastStore.getState().addToast({ title, description, variant: "warning" }),
  info: (description: React.ReactNode, title = "Informasi") =>
    useToastStore.getState().addToast({ title, description, variant: "default" }),
  dismiss: (id: string) => useToastStore.getState().removeToast(id),
};

