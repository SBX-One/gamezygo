import * as React from "react";
import { cn } from "@/lib/utils";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Pill } from "@/components/ui/Pill";
import type { OrderHistoryItem } from "../types";
import { Button } from "@/components/ui";

export interface OrderHistoryTableProps {
  items: OrderHistoryItem[];
  onItemClick?: (order: OrderHistoryItem) => void;
  className?: string;
}

export function OrderHistoryTable({ items, onItemClick, className }: OrderHistoryTableProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const columns: TableColumn<OrderHistoryItem>[] = [
    {
      id: "title",
      header: "Nama",
      width: "w-[24%]",
      cell: (order) => (
        <Button
          onClick={() => onItemClick?.(order)}
          variant="outline"
          size="sm"
          className="cursor-pointer underline-offset-4 active:scale-[0.98] transition-all text-left whitespace-normal wrap-break-word max-w-full"
        >
          {order.gameTitle}
        </Button>
      ),
    },
    {
      id: "purchaseDate",
      header: "Waktu Beli",
      width: "w-[14%]",
      cell: (order) => (
        <span className="text-gray-300 text-body-sm whitespace-nowrap">{order.purchaseDate}</span>
      ),
    },
    {
      id: "paymentMethod",
      header: "Metode Pembayaran",
      width: "w-[21%]",
      cell: (order) => (
        <span className="text-gray-300 text-body-sm whitespace-nowrap">{order.paymentMethod}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      width: "w-[13%]",
      cell: (order) => {
        if (order.status === "Berhasil") {
          return (
            <Pill
              variant="success"
              size="xs"
              className="px-3.5 py-1 font-medium whitespace-nowrap"
            >
              Berhasil
            </Pill>
          );
        }
        if (order.status === "Pending") {
          return (
            <Pill
              variant="warning"
              size="xs"
              className="px-3.5 py-1 font-medium whitespace-nowrap"
            >
              Pending
            </Pill>
          );
        }
        return (
          <Pill
            variant="error"
            size="xs"
            className="px-3.5 py-1 font-medium whitespace-nowrap"
          >
            {order.status}
          </Pill>
        );
      },
    },
    {
      id: "price",
      header: "Harga",
      width: "w-[14%]",
      cell: (order) => (
        <span className="text-gray-300 text-body-sm whitespace-nowrap">{order.formattedPrice}</span>
      ),
    },
    {
      id: "transactionId",
      header: "ID Transaksi",
      width: "w-[14%]",
      cell: (order) => (
        <span className="font-mono text-gray-400 text-body-sm whitespace-nowrap">{order.transactionId}</span>
      ),
    },
  ];

  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      <Table className="w-full" columns={columns} data={items} keyExtractor={(o) => o.id} />
    </div>
  );
}
