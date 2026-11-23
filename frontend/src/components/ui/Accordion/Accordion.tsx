import * as React from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  /** Identifier unik untuk item */
  id: string;
  /** Judul / Header accordion */
  title: React.ReactNode;
  /** Isi / Deskripsi accordion */
  content: React.ReactNode;
  /** Apakah item dinonaktifkan */
  disabled?: boolean;
}

export interface AccordionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Daftar item accordion */
  items?: AccordionItemData[];
  /** ID item yang terbuka secara default (Uncontrolled) */
  defaultOpenId?: string;
  /** ID item yang sedang terbuka (Controlled) */
  openId?: string;
  /** Callback saat item accordion dibuka / ditutup */
  onChange?: (id: string | null) => void;
  /** Memungkinkan banyak item terbuka secara bersamaan */
  allowMultiple?: boolean;
  /** Styling khusus landing page (p-6 dan rounded-2xl) */
  isLanding?: boolean;
}

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 transition-transform duration-200"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 transition-transform duration-200"
  >
    <path d="M5 12h14" />
  </svg>
);

export interface AccordionItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  isLanding?: boolean;
  children: React.ReactNode;
}

export function AccordionItem({
  title,
  isOpen = false,
  onToggle,
  disabled = false,
  isLanding,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const router = useRouter();
  const isLandingPage =
    isLanding ??
    (typeof router?.pathname === "string" &&
      (router.pathname === "/" || router.asPath === "/"));

  return (
    <div
      className={cn(
        isLandingPage ? "rounded-2xl" : "rounded-lg",
        "border-gradient-outline bg-(--gradient-surface-secondary-default) transition-all duration-200 select-none overflow-hidden active:border-0",
        "focus-within:ring-2 focus-within:ring-white/40",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      {/* Trigger Header */}
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "w-full flex items-center justify-between gap-4 text-left cursor-pointer transition-colors duration-150 outline-none focus:outline-none focus-visible:outline-none",
          isLandingPage ? "p-6" : "p-4",
          className
        )}
      >
        <span className="accordion-title text-gray-50 font-semibold text-body-md">
          {title}
        </span>
        <span className="accordion-icon text-deep-blue-100 flex items-center justify-center shrink-0">
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </span>
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div
          className={cn(
            "pt-1 text-gray-400 text-body-sm",
            isLandingPage ? "px-6 pb-6" : "px-4 pb-4"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function Accordion({
  items,
  defaultOpenId,
  openId,
  onChange,
  allowMultiple = false,
  isLanding,
  className,
  children,
  ...props
}: AccordionProps) {
  const router = useRouter();
  const isLandingPage =
    isLanding ??
    (typeof router?.pathname === "string" &&
      (router.pathname === "/" || router.asPath === "/"));

  const [openIds, setOpenIds] = React.useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  const currentOpenIds = openId !== undefined ? (openId ? [openId] : []) : openIds;

  const handleToggle = (id: string) => {
    if (allowMultiple) {
      const next = currentOpenIds.includes(id)
        ? currentOpenIds.filter((item) => item !== id)
        : [...currentOpenIds, id];
      setOpenIds(next);
      onChange?.(next[next.length - 1] || null);
    } else {
      const next = currentOpenIds.includes(id) ? [] : [id];
      setOpenIds(next);
      onChange?.(next[0] || null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)} {...props}>
      {items ? (
        items.map((item) => (
          <AccordionItem
            key={item.id}
            title={item.title}
            isOpen={currentOpenIds.includes(item.id)}
            disabled={item.disabled}
            isLanding={isLandingPage}
            onToggle={() => handleToggle(item.id)}
          >
            {item.content}
          </AccordionItem>
        ))
      ) : (
        children
      )}
    </div>
  );
}
