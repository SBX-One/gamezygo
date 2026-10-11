import * as React from "react";
import { cn } from "@/lib/utils";
import type { AdminAddProductFormData } from "../../../types/admin-add-product.types";

export interface AdminAddProductAccountInfoProps {
  formData: AdminAddProductFormData;
  onChange: (fields: Partial<AdminAddProductFormData>) => void;
  className?: string;
}

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

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

export function AdminAddProductAccountInfo({
  formData,
  onChange,
  className,
}: AdminAddProductAccountInfoProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tempUsername, setTempUsername] = React.useState(formData.accountUsername);
  const [tempPassword, setTempPassword] = React.useState(formData.accountPassword);

  const handleOpenModal = () => {
    setTempUsername(formData.accountUsername);
    setTempPassword(formData.accountPassword);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({
      accountUsername: tempUsername.trim() || formData.accountUsername,
      accountPassword: tempPassword.trim() || formData.accountPassword,
    });
    setIsModalOpen(false);
  };

  return (
    <div className={cn("flex flex-col gap-3.5 w-full", className)}>
      {/* Section Title */}
      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight select-none">
        Informasi Akun Game
      </h3>

      {/* Account Info Card (Matching Image 4) */}
      <div className="w-full rounded-xl border border-deep-blue-700 bg-deep-blue-950 p-5 sm:p-6 flex flex-col gap-4 shadow-sm select-none">
        {/* Row 1: Username */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-gray-400 font-normal">Username :</span>
            <span className="font-semibold text-white">
              {formData.accountUsername}
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1E202B] hover:bg-[#272A38] border border-deep-blue-700 text-xs sm:text-sm font-medium text-white transition-colors cursor-pointer"
          >
            <EditIcon className="w-3.5 h-3.5 text-gray-300" />
            <span>Edit</span>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-deep-blue-700/80 w-full" />

        {/* Row 2: Password */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-gray-400 font-normal">Password :</span>
            <span className="font-semibold text-white">
              {formData.accountPassword}
            </span>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1E202B] hover:bg-[#272A38] border border-deep-blue-700 text-xs sm:text-sm font-medium text-white transition-colors cursor-pointer"
          >
            <EditIcon className="w-3.5 h-3.5 text-gray-300" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          EDIT INFORMASI AKUN GAME MODAL
         ======================================================== */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="account-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
        >
          {/* Backdrop click to close */}
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-10 w-[480px] max-w-[95vw] rounded-2xl bg-[#13151F] border border-deep-blue-700 shadow-2xl p-6 select-none animate-in zoom-in-95 duration-150 text-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-deep-blue-700">
              <h4
                id="account-modal-title"
                className="text-base font-bold text-white tracking-tight"
              >
                Edit Informasi Akun Game
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveModal} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
                  Username Akun
                </label>
                <input
                  type="text"
                  required
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  placeholder="ex. shared_steam_01"
                  className="w-full h-10 px-3 bg-[#15161D] border border-deep-blue-700 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1.5">
                  Password Akun
                </label>
                <input
                  type="text"
                  required
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="ex. Password@123"
                  className="w-full h-10 px-3 bg-[#15161D] border border-deep-blue-700 rounded-lg text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-deep-blue-700/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#DF3848] to-[#FF5364] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
