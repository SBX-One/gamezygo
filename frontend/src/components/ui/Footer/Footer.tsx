import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { FooterProps, FooterColumn, SocialLink } from "./Footer.types";

/**
 * Gamezygo Logo Emblem SVG
 */
export const GamezygoEmblem = ({
  className,
  fill,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="45"
    height="24"
    viewBox="0 0 45 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("shrink-0", className)}
    {...props}
  >
    <path
      d="M0 24L17.7974 0H45L40.8762 4.18018H21.1978L8.46463 20.9009H16.3505L24.8875 12.6126L16.3505 14.7027L20.1849 9.22523H35.0161L22.4277 24H0Z"
      fill={fill || "currentColor"}
    />
    <path
      d="M27.492 19.6757L24.0916 24H29.5177L33.4244 19.6757H27.492Z"
      fill={fill || "currentColor"}
    />
  </svg>
);

/**
 * Plus / Add Icon from Fluent Assets (16px default)
 */
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M12 3.25C12.1989 3.25 12.3897 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4V11.25H20C20.1989 11.25 20.3897 11.329 20.5303 11.4697C20.671 11.6103 20.75 11.8011 20.75 12C20.75 12.1989 20.671 12.3897 20.5303 12.5303C20.3897 12.671 20.1989 12.75 20 12.75H12.75V20C12.75 20.1989 12.671 20.3897 12.5303 20.5303C12.3897 20.671 12.1989 20.75 12 20.75C11.8011 20.75 11.6103 20.671 11.4697 20.5303C11.329 20.3897 11.25 20.1989 11.25 20V12.75H4C3.80109 12.75 3.61032 12.671 3.46967 12.5303C3.32902 12.3897 3.25 12.1989 3.25 12C3.25 11.8011 3.32902 11.6103 3.46967 11.4697C3.61032 11.329 3.80109 11.25 4 11.25H11.25V4C11.25 3.80109 11.329 3.61032 11.4697 3.46967C11.6103 3.32902 11.8011 3.25 12 3.25Z"
      fill="currentColor"
    />
  </svg>
);

const defaultFooterColumns: FooterColumn[] = [
  {
    title: "Menu",
    links: [
      { label: "Katalog", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Promo Bundling", href: "#" },
      { label: "Cara Order", href: "#" },
    ],
  },
  {
    title: "Bantuan",
    links: [{ label: "Chat Admin via Telegram", href: "#" }],
  },
  {
    title: "Informasi",
    links: [
      { label: "Apa itu steam sharing?", href: "#" },
      { label: "Aturan pembelian", href: "#" },
      { label: "Kelebihan & kekurangan", href: "#" },
      { label: "Cek spesifikasi game", href: "#" },
    ],
  },
];

const defaultSocialLinks: SocialLink[] = [
  { ariaLabel: "Social 1", icon: <PlusIcon /> },
  { ariaLabel: "Social 2", icon: <PlusIcon /> },
  { ariaLabel: "Social 3", icon: <PlusIcon /> },
];

export function Footer({
  brandName = "Gamezygo",
  brandLogo,
  brandHref = "/",
  columns = defaultFooterColumns,
  socialTitle = "Sosial Media",
  socialLinks = defaultSocialLinks,
  className,
  ref,
  ...props
}: FooterProps) {
  return (
    <footer
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-deep-blue-950 text-gray-50 w-full select-none pt-27 px-6 md:px-30 pb-80",
        className
      )}
      {...props}
    >
      {/* ========================================================
          1. SVG Defs untuk Gradien Linear Primary Default (#BF3E42 -> #7F1D1D)
         ======================================================== */}
      <svg width="0" height="0" className="absolute pointer-events-none -">
        <defs>
          <linearGradient
            id="gamezygo-footer-primary-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="50%" stopColor="#BF3E42" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>
        </defs>
      </svg>

      {/* ========================================================
          2. Background Logo 1: Kiri Bawah (Linear Gradient Primary Default)
         ======================================================== */}
      <div className="absolute left-0 bottom-0 pointer-events-none z-0">
        <GamezygoEmblem
          className="w-70 sm:w-95 md:w-120 lg:w-157.5 h-auto object-contain translate-y-1/4 -translate-x-1/4"
          fill="url(#gamezygo-footer-primary-gradient)"
        />
      </div>

      {/* ========================================================
          3. Background Logo 2: Pojok Kanan Atas (Samar / Lower Opacity di bawah Sosial Media)
         ======================================================== */}
      <div className="absolute right-0 top-0 pointer-events-none z-0 opacity-10 sm:opacity-15">
        <GamezygoEmblem
          className="w-80 sm:w-110 md:w-157.5 h-auto object-contain -translate-y-2/5 translate-x-2/5"
          fill="url(#gamezygo-footer-primary-gradient)"
        />
      </div>

      {/* ========================================================
          4. Content Grid: 5 Kolom dengan Justify Between (z-10 di atas background logo)
         ======================================================== */}
      <div className="relative z-10 w-full max-w-300 mx-auto flex flex-col md:flex-row justify-between items-start gap-10 md:gap-8">
        {/* Kolom 1: Brand (Logo Putih + Text H4 Semi Bold) */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={brandHref}
            className="flex items-center gap-3 group outline-none"
          >
            {brandLogo ? (
              brandLogo
            ) : (
              <GamezygoEmblem className="w-8 h-4.5 text-gray-50 group-hover:text-gray-50 transition-colors" />
            )}
            <span className="text-h4 font-semibold text-gray-50 group-hover:text-gray-50 tracking-tight transition-colors">
              {brandName}
            </span>
          </Link>
        </div>

        {/* Kolom 2, 3, 4: Navigasi Links (Menu, Bantuan, Informasi) */}
        {columns.map((col, idx) => (
          <div key={col.title || idx} className="flex flex-col gap-4 min-w-30">
            <h4 className="text-body-md font-semibold text-gray-50 tracking-normal">
              {col.title}
            </h4>
            <ul className="flex flex-col gap-4">
              {col.links.map((link, linkIdx) => (
                <li key={link.label || linkIdx}>
                  {link.href ? (
                    <Link
                      href={link.href}
                      onClick={link.onClick}
                      className="text-body-md font-normal text-gray-400 hover:text-gray-50 transition-colors duration-150 block"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={link.onClick}
                      className="text-body-md font-normal text-gray-400 hover:text-gray-50 transition-colors duration-150 text-left cursor-pointer"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Kolom 5: Sosial Media (Header FAFAFA Body MD Semi Bold + Button Secondary MD) */}
        <div className="flex flex-col gap-4">
          <h4 className="text-body-md font-semibold text-gray-50 tracking-normal">
            {socialTitle}
          </h4>
          <div className="flex items-center gap-3">
            {socialLinks.map((social, sIdx) => (
              <Button
                key={social.ariaLabel || sIdx}
                variant="secondary"
                size="md"
                className="w-11! h-11! p-0! flex items-center justify-center shrink-0 cursor-pointer"
                aria-label={social.ariaLabel || `Social button ${sIdx + 1}`}
                onClick={social.onClick}
              >
                {social.icon || <PlusIcon className="w-4 h-4 text-deep-blue-100" />}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
