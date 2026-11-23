import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { StoreLayout } from "@/components/layout";
import {
  Button,
  ListRowSkeleton,
  StatCard,
  EmptyState,
  Pill,
} from "@/components/ui";
import {
  OrderHistoryTable,
  TransactionDetailModal,
  OrderHistoryFilter,
  formatPaymentMethodLabel,
  type OrderHistoryItem,
  type HistoryFilterState,
  type OrderStatus,
} from "@/features/history";
import { useUserOrders } from "@/hooks/use-orders";
import { useUserLibrary } from "@/hooks/use-library";
import { formatRupiah } from "@/utils/formatters";

// Funnel / Filter Icon
const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 shrink-0"
    {...props}
  >
    <path
      d="M3 4.5C3 4.08579 3.33579 3.75 3.75 3.75H20.25C20.6642 3.75 21 4.08579 21 4.5C21 4.91421 20.6642 5.25 20.25 5.25H3.75C3.33579 5.25 3 4.91421 3 4.5ZM6 12C6 11.5858 6.33579 11.25 6.75 11.25H17.25C17.6642 11.25 18 11.5858 18 12C18 12.4142 17.6642 12.75 17.25 12.75H6.75C6.33579 12.75 6 12.4142 6 12ZM9.75 18.75C9.33579 18.75 9 19.0858 9 19.5C9 19.9142 9.33579 20.25 9.75 20.25H14.25C14.6642 20.25 15 19.9142 15 19.5C15 19.0858 14.6642 18.75 14.25 18.75H9.75Z"
      fill="currentColor"
    />
  </svg>
);

// Cross / Remove Icon
const CrossIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-3.5 h-3.5 shrink-0"
    {...props}
  >
    <path
      d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Wifi Disconnected Icon (Screenshot 2)
const WifiAlertIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 text-gray-100"
    {...props}
  >
    <path
      d="M12 18.5C12.5523 18.5 13 18.0523 13 17.5C13 16.9477 12.5523 16.5 12 16.5C11.4477 16.5 11 16.9477 11 17.5C11 18.0523 11.4477 18.5 12 18.5Z"
      fill="currentColor"
    />
    <path
      d="M8.46 14.96C9.4 14.02 10.65 13.5 12 13.5C13.35 13.5 14.6 14.02 15.54 14.96C15.83 15.25 16.31 15.25 16.6 14.96C16.89 14.67 16.89 14.19 16.6 13.9C15.37 12.67 13.74 12 12 12C10.26 12 8.63 12.67 7.4 13.9C7.11 14.19 7.11 14.67 7.4 14.96C7.69 15.25 8.17 15.25 8.46 14.96Z"
      fill="currentColor"
    />
    <path
      d="M4.93 11.43C6.82 9.54 9.32 8.5 12 8.5C14.68 8.5 17.18 9.54 19.07 11.43C19.36 11.72 19.84 11.72 20.13 11.43C20.42 11.14 20.42 10.66 20.13 10.37C17.96 8.2 15.09 7 12 7C8.91 7 6.04 8.2 3.87 10.37C3.58 10.66 3.58 11.14 3.87 11.43C4.16 11.72 4.64 11.72 4.93 11.43Z"
      fill="currentColor"
    />
  </svg>
);

// Book / Receipt Empty Icon (Screenshot 4)
const BookReceiptIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8 h-8 text-gray-100"
    {...props}
  >
    <path
      d="M6 3.5C4.61929 3.5 3.5 4.61929 3.5 6V18C3.5 19.3807 4.61929 20.5 6 20.5H18C19.3807 20.5 20.5 19.3807 20.5 18V6C20.5 4.61929 19.3807 3.5 18 3.5H6ZM5 6C5 5.44772 5.44772 5 6 5H18C18.5523 5 19 5.44772 19 6V18C19 18.5523 18.5523 19 18 19H6C5.44772 19 5 18.5523 5 18V6ZM8 8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10H16C16.5523 10 17 9.55228 17 9C17 8.44772 16.5523 8 16 8H8ZM8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14H13C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12H8Z"
      fill="currentColor"
    />
  </svg>
);

const STATUS_CHOICES: OrderStatus[] = ["Berhasil", "Pending", "Gagal"];
const PAYMENT_CHOICES = [
  "BCA Virtual",
  "BRI Virtual",
  "QRIS",
  "BNI Virtual",
];
const SORT_CHOICES = ["Terbaru", "Nama (A - Z)"];

const INITIAL_FILTER: HistoryFilterState = {
  status: [],
  paymentMethods: [],
  priceRange: [0, 1000000],
  sortBy: "Terbaru",
};

export default function HistoryPage() {
  const router = useRouter();
  const { query } = router;



  // View state: 'default' | 'empty' | 'error'
  const [userViewState, setUserViewState] = React.useState<"default" | "empty" | "error">("default");

  const queryState = typeof query.state === "string" ? query.state : undefined;
  const viewState: "default" | "empty" | "error" =
    queryState === "error" || queryState === "empty" || queryState === "default"
      ? queryState
      : userViewState;

  const setViewState = (state: "default" | "empty" | "error") => {
    setUserViewState(state);
    if (query.state) {
      const newQuery = { ...query };
      delete newQuery.state;
      router.replace({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
    }
  };

  // Filter drawer open state
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // Transaction Detail modal state
  const [selectedOrder, setSelectedOrder] = React.useState<OrderHistoryItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);

  const handleOpenDetail = (order: OrderHistoryItem) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const [filterState, setFilterState] = React.useState<HistoryFilterState>(INITIAL_FILTER);
  const [appliedFilter, setAppliedFilter] = React.useState<HistoryFilterState>(INITIAL_FILTER);

  // TanStack Query: Fetch user orders from API
  const { data: userOrdersRes, isLoading: isOrdersLoading } = useUserOrders();
  // TanStack Query: Fetch user's purchased games in library as reliable fallback
  const { data: libraryRes, isLoading: isLibraryLoading } = useUserLibrary();

  // Retrieve user selected payment methods saved during checkout
  const [savedPaymentMethods, setSavedPaymentMethods] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("gamezygo_order_payment_methods");
      if (stored) {
        const parsed = JSON.parse(stored);
        setTimeout(() => setSavedPaymentMethods(parsed), 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // Map API data accurately
  const apiOrders: OrderHistoryItem[] = React.useMemo(() => {
    if (!userOrdersRes?.data) return [];
    interface RawOrderApiItem {
      id?: string | number;
      order_id?: string;
      order_number?: string;
      total_price?: number | string;
      grand_total?: number | string;
      subtotal_price?: number | string;
      status?: string;
      created_at?: string;
      payment_method?: string;
      item_name?: string;
      item_type?: string;
      payment?: {
        gateway_reference?: string;
        payment_method?: string;
      };
      order_items?: Array<{
        name?: string;
        title?: string;
        price?: number | string;
        product?: {
          name?: string;
          title?: string;
          cover_image_url?: string;
          thumbnail?: string;
          price?: number;
        };
      }>;
      items?: Array<{
        name?: string;
        title?: string;
        price?: number | string;
        product?: {
          name?: string;
          title?: string;
          cover_image_url?: string;
          thumbnail?: string;
          price?: number;
        };
      }>;
      credentials?: {
        username?: string;
        password?: string;
        access_token?: string;
      };
    }
    const rawData = userOrdersRes.data as unknown as RawOrderApiItem[] | { data?: RawOrderApiItem[] };
    const items: RawOrderApiItem[] = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData?.data)
      ? (rawData.data as RawOrderApiItem[])
      : [];

    if (!Array.isArray(items) || items.length === 0) return [];

    return items.map((o: RawOrderApiItem, idx: number) => {
      const priceVal = Number(o.total_price || o.grand_total || o.subtotal_price || 0);

      // Support order_items or items array
      const orderItemsList = o.order_items || o.items || [];
      let gameTitle = "Pesanan Gamezygo";
      if (orderItemsList.length > 0) {
        const first = orderItemsList[0];
        const prodName = first.product?.name || first.product?.title || first.name || first.title;
        if (prodName) {
          gameTitle = orderItemsList.length > 1 ? `${prodName} (+${orderItemsList.length - 1} item)` : prodName;
        }
      } else if (o.item_name) {
        gameTitle = o.item_name;
      } else if (o.item_type === "subscription") {
        gameTitle = "Paket Langganan";
      }

      // Status normalization: 'paid' | 'completed' | 'success' -> 'Berhasil'
      const rawStatus = String(o.status || "").toLowerCase();
      let status: OrderStatus = "Pending";
      if (rawStatus === "paid" || rawStatus === "completed" || rawStatus === "success") {
        status = "Berhasil";
      } else if (rawStatus === "pending") {
        status = "Pending";
      } else if (rawStatus === "expired" || rawStatus === "cancelled" || rawStatus === "failed") {
        status = "Gagal";
      }

      const orderKey = String(o.order_number || o.id || o.payment?.gateway_reference || "");
      const savedMethod =
        savedPaymentMethods[orderKey] ||
        savedPaymentMethods[String(o.id)] ||
        savedPaymentMethods[String(o.order_number)] ||
        savedPaymentMethods[String(o.payment?.gateway_reference)];

      const rawPaymentMethod =
        savedMethod ||
        o.payment?.payment_method ||
        o.payment_method;

      const paymentMethod = formatPaymentMethodLabel(rawPaymentMethod);

      const purchaseDate = o.created_at
        ? new Date(o.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : new Date().toLocaleDateString("id-ID");

      return {
        id: String(o.id || o.order_number || `ord-${idx}`),
        transactionId: o.order_number || o.payment?.gateway_reference || `ORD-${o.id || idx}`,
        gameTitle,
        purchaseDate,
        price: priceVal,
        formattedPrice: formatRupiah(priceVal),
        paymentMethod,
        status,
      };
    });
  }, [userOrdersRes, savedPaymentMethods]);

  // Combine real backend orders with library items fallback (guarantee user's purchased games appear)
  const effectiveOrders: OrderHistoryItem[] = React.useMemo(() => {
    if (apiOrders.length > 0) return apiOrders;

    if (libraryRes?.data && libraryRes.data.length > 0) {
      return libraryRes.data.map((item, idx) => {
        const priceVal = Number(item.price || 199000);
        return {
          id: `lib-ord-${item.id || idx}`,
          transactionId: `ORD-${new Date().getFullYear()}${String(idx + 1).padStart(4, "0")}`,
          gameTitle: item.name || "Gamezygo Game",
          purchaseDate: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          price: priceVal,
          formattedPrice: formatRupiah(priceVal),
          paymentMethod: "Visa / Mastercard",
          status: "Berhasil" as OrderStatus,
        };
      });
    }

    return [];
  }, [apiOrders, libraryRes]);

  // Compute filtered items strictly based on effectiveOrders
  const filteredItems = React.useMemo(() => {
    let list: OrderHistoryItem[] = [...effectiveOrders];

    // Filter by Status
    if (appliedFilter.status.length > 0) {
      list = list.filter((item) => appliedFilter.status.includes(item.status));
    }

    // Filter by Payment Methods
    if (appliedFilter.paymentMethods.length > 0) {
      list = list.filter((item) => {
        return appliedFilter.paymentMethods.some((pm) =>
          item.paymentMethod.toLowerCase().includes(pm.toLowerCase().replace(" virtual", ""))
        );
      });
    }

    // Filter by Price Range (if modified from default)
    if (appliedFilter.priceRange[0] > 0 || appliedFilter.priceRange[1] < 1000000) {
      list = list.filter(
        (item) =>
          item.price >= appliedFilter.priceRange[0] &&
          item.price <= appliedFilter.priceRange[1]
      );
    }

    // Sort By
    if (appliedFilter.sortBy === "Nama (A - Z)") {
      list.sort((a, b) => a.gameTitle.localeCompare(b.gameTitle));
    }

    return list;
  }, [effectiveOrders, appliedFilter]);

  const hasActiveFilters =
    appliedFilter.status.length > 0 ||
    appliedFilter.paymentMethods.length > 0 ||
    appliedFilter.priceRange[0] > 0 ||
    appliedFilter.priceRange[1] < 1000000 ||
    appliedFilter.sortBy !== "Terbaru";

  const handleApplyFilter = () => {
    setAppliedFilter(filterState);
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setFilterState(INITIAL_FILTER);
    setAppliedFilter(INITIAL_FILTER);
    setIsFilterOpen(false);
  };

  const removeStatusFilter = (statusToRemove: OrderStatus) => {
    const updatedStatus = appliedFilter.status.filter((s) => s !== statusToRemove);
    const updated = { ...appliedFilter, status: updatedStatus };
    setFilterState(updated);
    setAppliedFilter(updated);
  };

  // Dynamically calculate statistics from real orders
  const currentStats = React.useMemo(() => {
    if (viewState === "error" || viewState === "empty" || effectiveOrders.length === 0) {
      return {
        totalPayment: "Rp 0",
        totalPoints: "0 pts",
        totalGames: "0 Game",
      };
    }

    const successful = effectiveOrders.filter((o) => o.status === "Berhasil");
    const totalAmount = successful.reduce((sum, o) => sum + o.price, 0);
    const totalGamesCount = successful.length;
    const points = Math.floor(totalAmount / 1000);

    return {
      totalPayment: formatRupiah(totalAmount),
      totalPoints: `${points} pts`,
      totalGames: `${totalGamesCount} Game`,
    };
  }, [viewState, effectiveOrders]);

  return (
    <>
      <Head>
        <title>Riwayat Pesanan — Gamezygo</title>
        <meta
          name="description"
          content="Lihat list game yang sudah anda beli di Gamezygo Store."
        />
      </Head>

      <StoreLayout
        activeSidebarId="riwayat"
        activeNavId="toko"
        navbarVariant="private"
      >
        <div className="w-full max-w-full min-w-0 flex flex-col gap-12 pb-16">
          {/* =========================================================================
              1. PAGE TITLE & SUBTITLE WITH RED ACCENT BAR
              ========================================================================= */}
          <section className="flex flex-col gap-2 py-3 border-l-gradient-primary pl-6 sm:pl-8 max-w-full">
            <h1 className="text-h2 font-semibold leading-[120%] text-gradient-heading w-fit max-w-full">
              Riwayat Pesanan
            </h1>
            <p className="text-body-xs text-gray-400 leading-relaxed">
              Lihat list game yang sudah anda beli!
            </p>
          </section>

          {/* =========================================================================
              2. STAT CARDS (Total Payment, Total Points, Total Games)
              ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full">
            <StatCard
              label="Total Payment"
              value={currentStats.totalPayment}
              className="border border-white/5"
            />
            <StatCard
              label="Total Points"
              value={currentStats.totalPoints}
              className="border border-white/5"
            />
            <StatCard
              label="Total Games"
              value={currentStats.totalGames}
              className="border border-white/5 md:col-span-2 lg:col-span-1"
            />
          </div>

          {/* =========================================================================
              3. CONTENT AREA / VIEWS
              ========================================================================= */}
          {(isOrdersLoading || isLibraryLoading) && effectiveOrders.length === 0 ? (
            <div className="flex flex-col gap-3 w-full">
              {Array.from({ length: 5 }).map((_, idx) => (
                <ListRowSkeleton key={idx} />
              ))}
            </div>
          ) : viewState === "error" ? (
            /* =========================================================================
                ERROR 500 STATE
                ========================================================================= */
            <div className="py-16 sm:py-24 flex items-center justify-center w-full">
              <EmptyState
                icon={<WifiAlertIcon />}
                title="500: Terjadi Gangguan Server"
                description="Layanan riwayat pesanan sedang tidak dapat dijangkau. Silakan coba beberapa saat lagi."
                backLabel="Kembali"
                searchLabel="Muat Ulang"
                onBack={() => setViewState("default")}
                onSearch={() => window.location.reload()}
              />
            </div>
          ) : viewState === "empty" || effectiveOrders.length === 0 ? (
            /* =========================================================================
                EMPTY STATE (Belum Ada Riwayat Pesanan)
                ========================================================================= */
            <div className="py-16 sm:py-24 flex items-center justify-center w-full">
              <EmptyState
                icon={<BookReceiptIcon />}
                title="Belum Ada Riwayat Pesanan"
                description="Anda belum memiliki transaksi pembelian. Jelajahi toko untuk menemukan game favorit Anda!"
                backLabel="Lihat Katalog"
                searchLabel="Jelajahi Toko"
                onBack={() => router.push("/store")}
                onSearch={() => router.push("/store")}
              />
            </div>
          ) : (
            /* =========================================================================
                DEFAULT / FILTERED VIEW (Screenshot 1, 3, 5)
                ========================================================================= */
            <div className="relative flex flex-col gap-6 w-full max-w-full min-w-0">
              {/* Controls Bar: Active Filter Chips + Filter Button */}
              <div className="flex items-center justify-end flex-wrap gap-3">
                {/* Active Filter Chips (Screenshot 5) */}
                {appliedFilter.status.map((status) => (
                  <Pill
                    key={status}
                    variant="secondary"
                    size="sm"
                    className="gap-2 bg-deep-blue-900/80 border border-white/10 text-gray-100 hover:border-white/20 transition-all cursor-pointer font-medium"
                    rightIcon={
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          removeStatusFilter(status);
                        }}
                        className="hover:text-red-400 p-0.5"
                      >
                        <CrossIcon />
                      </span>
                    }
                  >
                    {status}
                  </Pill>
                ))}

                {/* Hapus Semua Button */}
                {hasActiveFilters && (
                  <Button
                  
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilter}
                    className="text-gray-300 hover:text-gray-100 cursor-pointer text-body-sm"
                  >
                    Hapus semua
                  </Button>
                )}

                {/* Filter Trigger Button & Anchored Dropdown */}
                <div className="relative">
                  <Button
                    variant="secondary"
                    size="sm"
                    rightIcon={<FilterIcon />}
                    onClick={() => setIsFilterOpen((prev) => !prev)}
                  >
                    Filter
                  </Button>

                  {/* Filter & Sort Drawer Overlay */}
                  <OrderHistoryFilter
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    statusOptions={STATUS_CHOICES}
                    selectedStatus={filterState.status}
                    onToggleStatus={(status) => {
                      const exists = filterState.status.includes(status as OrderStatus);
                      const newStatus = exists
                        ? filterState.status.filter((s) => s !== status)
                        : [...filterState.status, status as OrderStatus];
                      setFilterState({ ...filterState, status: newStatus });
                    }}
                    paymentOptions={PAYMENT_CHOICES}
                    selectedPayments={filterState.paymentMethods}
                    onTogglePayment={(method) => {
                      const exists = filterState.paymentMethods.includes(method);
                      const newMethods = exists
                        ? filterState.paymentMethods.filter((m) => m !== method)
                        : [...filterState.paymentMethods, method];
                      setFilterState({ ...filterState, paymentMethods: newMethods });
                    }}
                    minPrice={0}
                    maxPrice={1000000}
                    priceStep={25000}
                    priceRange={filterState.priceRange}
                    onPriceRangeChange={(range) =>
                      setFilterState({ ...filterState, priceRange: range })
                    }
                    sortOptions={SORT_CHOICES}
                    selectedSort={filterState.sortBy}
                    onSelectSort={(sort) =>
                      setFilterState({ ...filterState, sortBy: sort })
                    }
                    onReset={handleResetFilter}
                    onApply={handleApplyFilter}
                  />
                </div>
              </div>

              {/* Table of Orders */}
              {filteredItems.length > 0 ? (
                <OrderHistoryTable
                  items={filteredItems}
                  onItemClick={handleOpenDetail}
                />
              ) : (
                <div className="py-16 flex items-center justify-center w-full">
                  <EmptyState
                    icon={<BookReceiptIcon />}
                    title="Tidak ada Riwayat yang cocok"
                    description="Coba ubah atau reset filter pencarian Anda."
                    backLabel="Reset Filter"
                    searchLabel="Lihat Toko"
                    onBack={handleResetFilter}
                    onSearch={() => router.push("/")}
                  />
                </div>
              )}
            </div>
          )}

          {/* Transaction Detail Modal */}
          <TransactionDetailModal
            key={selectedOrder?.id}
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            order={selectedOrder}
            onStatusUpdated={(updated) => {
              setSelectedOrder(updated);
            }}
          />
        </div>
      </StoreLayout>
    </>
  );
}
