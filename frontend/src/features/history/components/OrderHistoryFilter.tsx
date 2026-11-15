import * as React from "react";
import { FilterModal } from "@/components/ui/FilterModal";

export interface OrderHistoryFilterProps {
  isOpen: boolean;
  onClose: () => void;
  statusOptions?: string[];
  selectedStatus?: string[];
  onToggleStatus?: (status: string) => void;
  paymentOptions?: string[];
  selectedPayments?: string[];
  onTogglePayment?: (payment: string) => void;
  minPrice?: number;
  maxPrice?: number;
  priceStep?: number;
  priceRange?: [number, number];
  onPriceRangeChange?: (range: [number, number]) => void;
  sortOptions?: string[];
  selectedSort?: string;
  onSelectSort?: (sort: string) => void;
  onReset?: () => void;
  onApply?: () => void;
  className?: string;
}

export function OrderHistoryFilter({
  isOpen,
  onClose,
  statusOptions = ["Berhasil", "Pending", "Gagal"],
  selectedStatus = [],
  onToggleStatus,
  paymentOptions = ["Visa / Mastercard", "QRIS", "BCA Virtual", "BRI Virtual", "BNI Virtual"],
  selectedPayments = [],
  onTogglePayment,
  minPrice = 0,
  maxPrice = 1000000,
  priceStep = 25000,
  priceRange = [0, 1000000],
  onPriceRangeChange,
  sortOptions = ["Terbaru", "Nama (A - Z)"],
  selectedSort = "Terbaru",
  onSelectSort,
  onReset,
  onApply,
  className,
}: OrderHistoryFilterProps) {
  return (
    <FilterModal
      isOpen={isOpen}
      onClose={onClose}
      variant="dialog"
      categories={[]}
      genres={[]}
      launchers={[]}
      statusOptions={statusOptions}
      selectedStatus={selectedStatus}
      onToggleStatus={onToggleStatus}
      paymentOptions={paymentOptions}
      selectedPayments={selectedPayments}
      onTogglePayment={onTogglePayment}
      minPrice={minPrice}
      maxPrice={maxPrice}
      priceStep={priceStep}
      priceRange={priceRange}
      onPriceRangeChange={onPriceRangeChange}
      sortOptions={sortOptions}
      selectedSort={selectedSort}
      onSelectSort={onSelectSort}
      onReset={onReset}
      onApply={() => {
        if (onApply) onApply();
        onClose();
      }}
      className={className}
    />
  );
}

export default OrderHistoryFilter;
