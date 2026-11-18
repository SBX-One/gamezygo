import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Skeleton } from "@/components/ui/Skeleton";
import type { CredentialRevealerProps } from "../types";

// ============================================================================
// SVG ICONS
// ============================================================================

const ShieldUserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    {...props}
  >
    <path
      d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 15C8.5 13.6193 10.067 12.5 12 12.5C13.933 12.5 15.5 13.6193 15.5 15"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeOffIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="9"
      y="9"
      width="13"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * CredentialRevealer Component
 *
 * Secure, glassmorphic UI component to reveal, mask, and copy game account credentials.
 * Complies with Gamezygo PRD (US-002: Secure Game Library Delivery & FR-04: Isolated Game Library Delivery).
 */
export function CredentialRevealer({
  gameTitle,
  username = "-",
  password = "-",
  accessToken,
  isPreorder = false,
  isLoading = false,
  supportPhone = "6281234567890",
  onCopySuccess,
  className,
}: CredentialRevealerProps) {
  // Visibility states
  const [showUsername, setShowUsername] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showToken, setShowToken] = React.useState(false);

  // Copied indicator feedback states
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const handleCopy = async (text: string, fieldName: string) => {
    if (isPreorder || !text || text === "-") return;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        onCopySuccess?.(fieldName);

        setTimeout(() => {
          setCopiedField(null);
        }, 2500);
      }
    } catch (err) {
      console.warn("Failed to copy credential to clipboard:", err);
    }
  };

  const handleContactAdmin = () => {
    const message = encodeURIComponent(
      `Halo Admin Gamezygo, saya butuh bantuan terkait akun untuk game "${gameTitle}".`
    );
    window.open(`https://wa.me/${supportPhone}?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full rounded-lg bg-deep-blue-900 border border-white/10 p-5 flex flex-col gap-4 shadow-xl select-none",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <Skeleton className="w-11 h-11 rounded-lg" />
          <Skeleton className="h-6 w-44" />
        </div>
        <div className="w-full rounded-lg border border-white/10 p-4 flex flex-col gap-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full rounded-lg bg-deep-blue-900 border border-white/10 p-5 flex flex-col gap-4 shadow-xl select-none transition-all duration-200",
        className
      )}
    >
      {/* 1. Header: Shield Icon + Section Title */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-deep-blue-800 border border-deep-blue-700/80 p-2.5 flex items-center justify-center text-rose-400 shrink-0 shadow-inner">
            <ShieldUserIcon />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-50 text-body-lg">
              Informasi Akun Game
            </span>
            <span className="text-body-xs text-gray-400">
              Kredensial akun aman terenkripsi AES-256
            </span>
          </div>
        </div>

        {/* Status Badge */}
        {isPreorder ? (
          <Pill
            variant="warning"
            size="xs"
            className="bg-[#2B1B10] text-amber-500 border border-amber-900/40"
          >
            Pre-order
          </Pill>
        ) : (
          <Pill
            variant="secondary"
            size="xs"
            className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
          >
            Siap Dimainkan
          </Pill>
        )}
      </div>

      {/* 2. Pre-order Notice Pill (shown when game is pre-order) */}
      {isPreorder && (
        <div className="flex justify-center w-full py-1">
          <div className="w-full py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
            <p className="text-body-xs text-amber-300 font-medium">
              Game ini masih dalam status Pre-order. Kredensial akun akan otomatis tersedia setelah game resmi dirilis.
            </p>
          </div>
        </div>
      )}

      {/* 3. Unified Credentials Box */}
      <div className="w-full rounded-lg border-gradient-secondary overflow-hidden bg-deep-blue-950/50 backdrop-blur-sm">
        {/* Username Row */}
        <div className="mx-4 py-3 flex items-center justify-between border-b-gradient-secondary">
          <div className="flex items-center min-w-0 pr-2">
            <span className="text-gray-400 text-body-xs w-20 shrink-0">Username :</span>
            <span className="font-mono text-sm text-gray-100 font-semibold truncate ml-1">
              {isPreorder ? "-" : showUsername ? username : "*********"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Toggle Visibility */}
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={isPreorder}
              onClick={() => !isPreorder && setShowUsername(!showUsername)}
              className={cn(
                "p-1.5 text-gray-400 transition-colors border-gradient-secondary h-8 w-8",
                isPreorder
                  ? "opacity-40 cursor-not-allowed text-gray-500"
                  : "hover:text-white cursor-pointer active:scale-95"
              )}
              title={
                isPreorder
                  ? "Belum tersedia"
                  : showUsername
                  ? "Sembunyikan Username"
                  : "Tampilkan Username"
              }
              aria-label={showUsername ? "Sembunyikan Username" : "Tampilkan Username"}
            >
              {showUsername && !isPreorder ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </Button>

            {/* Copy Button */}
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={isPreorder}
              onClick={() => handleCopy(username, "Username")}
              className={cn(
                "p-1.5 text-gray-400 transition-colors border-gradient-secondary h-8 w-8",
                copiedField === "Username" && "text-emerald-400 border-emerald-500/50",
                isPreorder
                  ? "opacity-40 cursor-not-allowed text-gray-500"
                  : "hover:text-white cursor-pointer active:scale-95"
              )}
              title={isPreorder ? "Belum tersedia" : "Salin Username"}
              aria-label="Salin Username"
            >
              {copiedField === "Username" ? (
                <CheckIcon className="w-4 h-4 text-emerald-400" />
              ) : (
                <CopyIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Password Row */}
        <div
          className={cn(
            "mx-4 py-3 flex items-center justify-between",
            accessToken ? "border-b-gradient-secondary" : ""
          )}
        >
          <div className="flex items-center min-w-0 pr-2">
            <span className="text-gray-400 text-body-xs w-20 shrink-0">Password :</span>
            <span className="font-mono text-sm text-gray-100 font-semibold truncate ml-1">
              {isPreorder ? "-" : showPassword ? password : "**********"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Toggle Visibility */}
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={isPreorder}
              onClick={() => !isPreorder && setShowPassword(!showPassword)}
              className={cn(
                "p-1.5 text-gray-400 transition-colors border-gradient-secondary h-8 w-8",
                isPreorder
                  ? "opacity-40 cursor-not-allowed text-gray-500"
                  : "hover:text-white cursor-pointer active:scale-95"
              )}
              title={
                isPreorder
                  ? "Belum tersedia"
                  : showPassword
                  ? "Sembunyikan Password"
                  : "Tampilkan Password"
              }
              aria-label={showPassword ? "Sembunyikan Password" : "Tampilkan Password"}
            >
              {showPassword && !isPreorder ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </Button>

            {/* Copy Button */}
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={isPreorder}
              onClick={() => handleCopy(password, "Password")}
              className={cn(
                "p-1.5 text-gray-400 transition-colors border-gradient-secondary h-8 w-8",
                copiedField === "Password" && "text-emerald-400 border-emerald-500/50",
                isPreorder
                  ? "opacity-40 cursor-not-allowed text-gray-500"
                  : "hover:text-white cursor-pointer active:scale-95"
              )}
              title={isPreorder ? "Belum tersedia" : "Salin Password"}
              aria-label="Salin Password"
            >
              {copiedField === "Password" ? (
                <CheckIcon className="w-4 h-4 text-emerald-400" />
              ) : (
                <CopyIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Optional Access Token / Steam Guard Row */}
        {accessToken && (
          <div className="mx-4 py-3 flex items-center justify-between">
            <div className="flex items-center min-w-0 pr-2">
              <span className="text-gray-400 text-body-xs w-20 shrink-0">Steam Guard :</span>
              <span className="font-mono text-sm text-amber-300 font-semibold truncate ml-1">
                {isPreorder ? "-" : showToken ? accessToken : "••••••••••"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="xs"
                disabled={isPreorder}
                onClick={() => !isPreorder && setShowToken(!showToken)}
                className={cn(
                  "p-1.5 text-gray-400 transition-colors border-gradient-secondary h-8 w-8",
                  isPreorder
                    ? "opacity-40 cursor-not-allowed text-gray-500"
                    : "hover:text-white cursor-pointer active:scale-95"
                )}
                title={showToken ? "Sembunyikan Token" : "Tampilkan Token"}
                aria-label="Toggle Token"
              >
                {showToken ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="xs"
                disabled={isPreorder}
                onClick={() => handleCopy(accessToken, "Steam Guard Token")}
                className={cn(
                  "p-1.5 text-gray-400 transition-colors border-gradient-secondary h-8 w-8",
                  copiedField === "Steam Guard Token" && "text-emerald-400 border-emerald-500/50",
                  isPreorder
                    ? "opacity-40 cursor-not-allowed text-gray-500"
                    : "hover:text-white cursor-pointer active:scale-95"
                )}
                title="Salin Token"
                aria-label="Salin Token"
              >
                {copiedField === "Steam Guard Token" ? (
                  <CheckIcon className="w-4 h-4 text-emerald-400" />
                ) : (
                  <CopyIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Footer: Help Text + Hubungi Admin WhatsApp CTA */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
        <span className="text-body-xs text-gray-400">
          Mengalami kendala login atau akun terkunci?
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleContactAdmin}
          className="gap-2 px-3 py-2 text-xs"
          title="Bantuan WhatsApp Admin Gamezygo"
        >
          <PhoneIcon className="w-3.5 h-3.5 text-gray-300" />
          <span>Hubungi Admin</span>
        </Button>
      </div>
    </div>
  );
}
