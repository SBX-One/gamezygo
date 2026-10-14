import * as React from "react";
import { cn } from "@/lib/utils";
import type { VoucherTargetUser } from "../../../types/admin-voucher.types";

export interface AdminAddVoucherUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsers: VoucherTargetUser[];
  onSaveUsers: (users: VoucherTargetUser[]) => void;
  className?: string;
}

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterFunnelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Mock Users matching Image 2
const MOCK_MODAL_USERS = [
  { id: "usr-1", email: "user123@test.com", points: "99pts" },
  { id: "usr-2", email: "user123@test.com", points: "99pts" },
  { id: "usr-3", email: "user123@test.com", points: "99pts" },
  { id: "usr-4", email: "user123@test.com", points: "99pts" },
  { id: "usr-5", email: "user123@test.com", points: "99pts" },
  { id: "usr-6", email: "user123@test.com", points: "99pts" },
  { id: "usr-7", email: "user123@test.com", points: "99pts" },
  { id: "usr-8", email: "user123@test.com", points: "99pts" },
  { id: "usr-9", email: "user123@test.com", points: "99pts" },
  { id: "usr-10", email: "user123@test.com", points: "99pts" },
];

export function AdminAddVoucherUserModal({
  isOpen,
  onClose,
  selectedUsers,
  onSaveUsers,
  className,
}: AdminAddVoucherUserModalProps) {
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Initialize selected IDs whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (selectedUsers.length > 0) {
        setSelectedIds(new Set(selectedUsers.map((u) => u.id)));
      } else {
        // By default, match Image 2 where all visible users are checked
        setSelectedIds(new Set(MOCK_MODAL_USERS.map((u) => u.id)));
      }
      setSearch("");
    }
  }, [isOpen, selectedUsers]);

  // Handle ESC key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredUsers = MOCK_MODAL_USERS.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const isAllSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((u) => selectedIds.has(u.id));

  const handleToggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (isAllSelected) {
      filteredUsers.forEach((u) => next.delete(u.id));
    } else {
      filteredUsers.forEach((u) => next.add(u.id));
    }
    setSelectedIds(next);
  };

  const handleToggleUser = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSave = () => {
    const selectedList: VoucherTargetUser[] = MOCK_MODAL_USERS.filter((u) =>
      selectedIds.has(u.id)
    ).map((u) => ({
      id: u.id,
      email: u.email,
      points: u.points,
    }));
    onSaveUsers(selectedList);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150 select-none font-sans"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "w-[760px] max-w-[95vw] rounded-2xl bg-[#0D0F18] border border-white/10 p-6 shadow-2xl space-y-4 text-left",
          className
        )}
      >
        {/* Header: Title + Close Icon (Matching Image 2) */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-tight">
            Add User
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Search Input Bar + Filter Button (Matching Image 2) */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative flex items-center">
            <div className="absolute left-3.5 text-gray-400 pointer-events-none">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari di toko"
              className="w-full h-11 pl-10 pr-10 bg-[#12141F] border border-deep-blue-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Hapus pencarian"
                className="absolute right-3.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Funnel Button (Matching Image 2) */}
          <button
            type="button"
            aria-label="Filter user"
            className="w-11 h-11 rounded-xl bg-[#12141F] border border-deep-blue-700/80 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <FilterFunnelIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Users Table Card (Matching Image 2) */}
        <div className="rounded-2xl border border-white/10 bg-[#0B0D14] overflow-hidden">
          {/* Table Header: Checkbox + Customer Email | Points */}
          <div className="h-11 px-4 border-b border-white/10 flex items-center justify-between text-xs font-semibold text-gray-400 select-none bg-[#0E101A]">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className={cn(
                  "w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0",
                  isAllSelected
                    ? "bg-[#181A24] border-white/40 text-white"
                    : "border-gray-600 bg-transparent hover:border-gray-400"
                )}
                aria-label="Pilih semua user"
              >
                {isAllSelected && <CheckIcon />}
              </button>
              <span>Customer Email</span>
            </div>

            <div className="text-right">
              <span>Points</span>
            </div>
          </div>

          {/* Table Rows (Scrollable) */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-white/5">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isSelected = selectedIds.has(user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => handleToggleUser(user.id)}
                    className="px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {/* Left: Checkbox + Email */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors shrink-0",
                          isSelected
                            ? "bg-[#181A24] border-white/40 text-white"
                            : "border-gray-600 bg-transparent"
                        )}
                      >
                        {isSelected && <CheckIcon />}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-200 truncate">
                        {user.email}
                      </span>
                    </div>

                    {/* Right: Points */}
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-gray-200">
                        {user.points}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-gray-400">
                Tidak ada user yang sesuai pencarian &quot;{search}&quot;
              </div>
            )}
          </div>
        </div>

        {/* Footer: Batalkan + Simpan (Matching Image 2) */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#161822] hover:bg-[#1E202B] border border-white/10 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer select-none"
          >
            Batalkan
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#DF3848] to-[#BA343C] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md select-none"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
