import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Skeleton } from "@/components/ui/Skeleton";
import type { CredentialRevealerProps } from "../types";

// ============================================================================
// SVG ICONS (Matching Original Figma Design Reference)
// ============================================================================

const DefaultPeopleSearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    {...props}
  >
    <path
      d="M11.91 14H19.753C20.3498 14 20.9221 14.2371 21.344 14.659C21.766 15.081 22.003 15.6533 22.003 16.25V17.155C22.003 17.6954 21.8862 18.2294 21.6607 18.7204C21.4351 19.2115 21.106 19.648 20.696 20C19.13 21.345 16.89 22.002 14 22.002H13.821C13.9719 21.6984 14.0314 21.3575 13.9921 21.0207C13.9529 20.6839 13.8167 20.3658 13.6 20.105L13.489 19.984L11.259 17.76C11.9192 16.625 12.1508 15.2907 11.91 14ZM6.50004 10.5C7.3549 10.5 8.19207 10.7436 8.91355 11.2021C9.63504 11.6606 10.211 12.3152 10.574 13.0891C10.937 13.8631 11.072 14.7244 10.9633 15.5724C10.8546 16.4203 10.5066 17.2197 9.96004 17.877L12.783 20.691C12.9163 20.8248 12.9942 21.004 13.0011 21.1928C13.008 21.3816 12.9435 21.566 12.8203 21.7092C12.6972 21.8524 12.5245 21.9439 12.3369 21.9654C12.1492 21.9869 11.9604 21.9367 11.808 21.825L11.723 21.753L8.82004 18.857C8.22564 19.2143 7.5567 19.4293 6.86547 19.4853C6.17424 19.5413 5.47941 19.4368 4.83523 19.18C4.19105 18.9231 3.61496 18.5208 3.15192 18.0045C2.68889 17.4883 2.35144 16.872 2.16594 16.2037C1.98043 15.5355 1.95188 14.8334 2.08251 14.1524C2.21314 13.4713 2.49942 12.8296 2.919 12.2774C3.33858 11.7252 3.88011 11.2775 4.5013 10.9692C5.1225 10.6609 5.80654 10.5003 6.50004 10.5ZM6.50004 12C5.7044 12 4.94133 12.3161 4.37872 12.8787C3.81612 13.4413 3.50004 14.2044 3.50004 15C3.50004 15.7957 3.81612 16.5587 4.37872 17.1213C4.94133 17.6839 5.7044 18 6.50004 18C7.29569 18 8.05876 17.6839 8.62137 17.1213C9.18397 16.5587 9.50004 15.7957 9.50004 15C9.50004 14.2044 9.18397 13.4413 8.62137 12.8787C8.05876 12.3161 7.29569 12 6.50004 12ZM14 2.005C14.6567 2.005 15.3068 2.13433 15.9135 2.38561C16.5201 2.63688 17.0713 3.00518 17.5356 3.46947C17.9999 3.93376 18.3682 4.48496 18.6194 5.09159C18.8707 5.69822 19 6.3484 19 7.005C19 7.66161 18.8707 8.31179 18.6194 8.91842C18.3682 9.52505 17.9999 10.0762 17.5356 10.5405C17.0713 11.0048 16.5201 11.3731 15.9135 11.6244C15.3068 11.8757 14.6567 12.005 14 12.005C12.674 12.005 11.4022 11.4782 10.4645 10.5405C9.52683 9.60286 9.00004 8.33109 9.00004 7.005C9.00004 5.67892 9.52683 4.40715 10.4645 3.46947C11.4022 2.53179 12.674 2.005 14 2.005Z"
      fill="currentColor"
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
      ry="2"
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
 * Restores the exact Figma Image 1 visual design while encapsulating
 * show/hide state, 1-click clipboard copy, pre-order handling,
 * and Steam Guard / access token support.
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

  // Copied indicator feedback
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
      `Halo Admin Gamezygo, saya butuh bantuan akun untuk game ${gameTitle}`
    );
    window.open(`https://wa.me/${supportPhone}?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "w-full rounded-lg bg-deep-blue-900 p-5 mt-5 flex flex-col gap-4 shadow-xl select-none",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <Skeleton className="rounded-lg w-11 h-11" />
          <Skeleton className="h-6 w-44" />
        </div>
        <div className="w-full rounded-lg border-gradient-secondary p-4 flex flex-col gap-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
        <div className="flex justify-end pt-1">
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full rounded-lg bg-deep-blue-900 p-5 mt-5 flex flex-col gap-4 shadow-xl select-none",
        className
      )}
    >
      {/* 1. Header (Exact Figma Design: DefaultPeopleSearchIcon + Single Title) */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-deep-blue-800 border border-deep-blue-700 p-3 flex items-center justify-center text-deep-blue-100 shrink-0">
          <DefaultPeopleSearchIcon />
        </div>
        <span className="font-semibold text-gray-50 text-body-lg">
          Informasi Akun Game
        </span>
      </div>

      {/* 2. Pre-order Notice Pill (Exact Previous Styling) */}
      {isPreorder && (
        <div className="flex justify-center w-full py-0.5">
          <Pill
            variant="warning"
            size="sm"
            className="bg-[#2B1B10] text-amber-600 border border-amber-900/40 font-medium px-4 py-1.5 rounded-full text-label-xs tracking-normal"
          >
            Game ini Pre-order Silahkan Tunggu Rilis
          </Pill>
        </div>
      )}

      {/* 3. Unified Credentials Box (Exact Previous border-gradient-secondary) */}
      <div className="w-full rounded-lg border-gradient-secondary">
        {/* Username Row */}
        <div className="mx-4 py-3 flex items-center justify-between border-b-gradient-secondary">
          <div className="flex items-center">
            <span className="text-gray-400 text-body-xs">Username :</span>
            <span className="font-mono text-sm text-white ml-2">
              {isPreorder ? "-" : showUsername ? username : "*********"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              disabled={isPreorder}
              onClick={() => !isPreorder && setShowUsername(!showUsername)}
              className={cn(
                "p-1 text-gray-400 transition-colors border-gradient-secondary",
                isPreorder
                  ? "opacity-40 cursor-not-allowed text-gray-500"
                  : "hover:text-white cursor-pointer"
              )}
              title={
                isPreorder
                  ? "Belum tersedia"
                  : showUsername
                  ? "Sembunyikan"
                  : "Tampilkan"
              }
            >
              {showUsername && !isPreorder ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="xs"
              disabled={isPreorder}
              onClick={() => !isPreorder && handleCopy(username, "Username")}
              className={cn(
                "p-1 text-gray-400 transition-colors",
                copiedField === "Username" && "text-emerald-400",
                isPreorder
                  ? "opacity-40 cursor-not-allowed text-gray-500"
                  : "hover:text-white cursor-pointer"
              )}
              title={isPreorder ? "Belum tersedia" : "Salin Username"}
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
            "px-4 py-3 flex items-center justify-between",
            accessToken ? "border-b-gradient-secondary" : ""
          )}
        >
          <div className="flex items-center">
            <span className="text-gray-400 text-body-xs">Password :</span>
            <span className="font-mono text-sm text-white ml-2">
              {isPreorder ? "-" : showPassword ? password : "**********"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              disabled={isPreorder}
              onClick={() => !isPreorder && setShowPassword(!showPassword)}
              className={cn(
                "p-1 text-gray-400 transition-colors border-gradient-secondary",
                isPreorder
                  ? "opacity-40 cursor-not-allowed text-gray-500"
                  : "hover:text-white cursor-pointer"
              )}
              title={
                isPreorder
                  ? "Belum tersedia"
                  : showPassword
                  ? "Sembunyikan"
                  : "Tampilkan"
              }
            >
              {showPassword && !isPreorder ? (
                <EyeOffIcon className="w-4 h-4" />
              ) : (
                <EyeIcon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="xs"
              disabled={isPreorder}
              onClick={() => !isPreorder && handleCopy(password, "Password")}
              className={cn(
                "p-1 text-gray-400 transition-colors",
                copiedField === "Password" && "text-emerald-400",
                isPreorder
                  ? "opacity-40 cursor-not-allowed text-gray-500"
                  : "hover:text-white cursor-pointer"
              )}
              title={isPreorder ? "Belum tersedia" : "Salin Password"}
            >
              {copiedField === "Password" ? (
                <CheckIcon className="w-4 h-4 text-emerald-400" />
              ) : (
                <CopyIcon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Optional Steam Guard / Access Token Row (if provided by Backend) */}
        {accessToken && (
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-gray-400 text-body-xs">Access Token :</span>
              <span className="font-mono text-sm text-white ml-2">
                {isPreorder ? "-" : showToken ? accessToken : "••••••••••••"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                disabled={isPreorder}
                onClick={() => !isPreorder && setShowToken(!showToken)}
                className={cn(
                  "p-1 text-gray-400 transition-colors border-gradient-secondary",
                  isPreorder
                    ? "opacity-40 cursor-not-allowed text-gray-500"
                    : "hover:text-white cursor-pointer"
                )}
                title={
                  isPreorder
                    ? "Belum tersedia"
                    : showToken
                    ? "Sembunyikan"
                    : "Tampilkan"
                }
              >
                {showToken && !isPreorder ? (
                  <EyeOffIcon className="w-4 h-4" />
                ) : (
                  <EyeIcon className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="xs"
                disabled={isPreorder}
                onClick={() => !isPreorder && handleCopy(accessToken, "Access Token")}
                className={cn(
                  "p-1 text-gray-400 transition-colors",
                  copiedField === "Access Token" && "text-emerald-400",
                  isPreorder
                    ? "opacity-40 cursor-not-allowed text-gray-500"
                    : "hover:text-white cursor-pointer"
                )}
                title={isPreorder ? "Belum tersedia" : "Salin Token"}
              >
                {copiedField === "Access Token" ? (
                  <CheckIcon className="w-4 h-4 text-emerald-400" />
                ) : (
                  <CopyIcon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Right-aligned Hubungi Admin Button (Exact Previous Styling) */}
      <div className="flex justify-end pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleContactAdmin}
        >
          <PhoneIcon className="w-3.5 h-3.5 text-gray-300" />
          <span>Hubungi Admin</span>
        </Button>
      </div>
    </div>
  );
}
