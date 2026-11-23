import type { ReactNode } from "react";

export interface AdminTimeframeOption {
  label: string;
  value: string;
}

export interface AdminMetricData {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  badge?: {
    text: string;
    trend?: "up" | "down";
  };
}

export interface AdminProductPerformance {
  id: string;
  name: string;
  fullName: string;
  revenue: number;
}

export interface AdminTransaction {
  id: string;
  customerEmail: string;
  productName: string;
  totalRevenue: string;
  date: string;
  status: "pending" | "completed" | "failed" | "refunded";
}

export interface AdminGameRequest {
  id: string;
  title: string;
  requesterCount: number;
  imageSrc: string;
  steamUrl?: string;
}
