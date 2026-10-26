import * as React from "react";
import { cn } from "@/lib/utils";
import type { ArticleBlockType } from "../../types/admin-article.types";

export interface SlashMenuItem {
  id: string;
  type: ArticleBlockType;
  title: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
}

export interface AdminArticleSlashMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: ArticleBlockType) => void;
  query: string;
  position?: { top: number; left: number };
  className?: string;
}

const SLASH_MENU_ITEMS: SlashMenuItem[] = [
  {
    id: "h1",
    type: "h1",
    title: "Heading 1",
    description: "Judul bagian besar",
    icon: <span className="font-bold text-label-xs">H1</span>,
    keywords: ["h1", "heading", "judul", "besar", "header"],
  },
  {
    id: "h2",
    type: "h2",
    title: "Heading 2",
    description: "Judul bagian sedang",
    icon: <span className="font-bold text-label-xs">H2</span>,
    keywords: ["h2", "heading", "judul", "sedang", "subjudul"],
  },
  {
    id: "h3",
    type: "h3",
    title: "Heading 3",
    description: "Subjudul bagian kecil",
    icon: <span className="font-bold text-label-xs">H3</span>,
    keywords: ["h3", "heading", "subjudul", "kecil"],
  },
  {
    id: "paragraph",
    type: "paragraph",
    title: "Teks Paragraf",
    description: "Teks biasa tanpa format khusus",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 4v16M18 4v16M6 4h12M4 9h6" />
      </svg>
    ),
    keywords: ["text", "paragraph", "teks", "paragraf", "plain"],
  },
  {
    id: "image",
    type: "image",
    title: "Upload Gambar",
    description: "Unggah gambar atau screenshot ilustrasi",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    keywords: ["image", "gambar", "foto", "upload", "img", "picture"],
  },
  {
    id: "bullet-list",
    type: "bullet-list",
    title: "Bulleted List",
    description: "Daftar poin dengan bullet",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="9" y1="6" x2="20" y2="6" />
        <line x1="9" y1="12" x2="20" y2="12" />
        <line x1="9" y1="18" x2="20" y2="18" />
        <circle cx="4" cy="6" r="1.5" fill="currentColor" />
        <circle cx="4" cy="12" r="1.5" fill="currentColor" />
        <circle cx="4" cy="18" r="1.5" fill="currentColor" />
      </svg>
    ),
    keywords: ["bullet", "list", "daftar", "poin", "ul"],
  },
  {
    id: "numbered-list",
    type: "numbered-list",
    title: "Numbered List",
    description: "Daftar langkah berurutan dengan angka",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="10" y1="6" x2="21" y2="6" />
        <line x1="10" y1="12" x2="21" y2="12" />
        <line x1="10" y1="18" x2="21" y2="18" />
        <path d="M4 6h2v4" />
        <path d="M4 10h4" />
      </svg>
    ),
    keywords: ["number", "numbered", "angka", "nomor", "ol"],
  },
  {
    id: "quote",
    type: "quote",
    title: "Quote",
    description: "Kutipan atau poin penting dengan garis aksen",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      </svg>
    ),
    keywords: ["quote", "kutipan", "blockquote"],
  },
  {
    id: "code",
    type: "code",
    title: "Code Block",
    description: "Blok kode dengan monospace",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    keywords: ["code", "kode", "program", "snippet", "syntax"],
  },
  {
    id: "callout",
    type: "callout",
    title: "Callout Info Box",
    description: "Kotak informasi atau peringatan menarik",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    keywords: ["callout", "info", "notice", "alert", "kotak"],
  },
  {
    id: "table",
    type: "table",
    title: "Tabel Grid",
    description: "Tabel 3x3 baris dan kolom interaktif",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
      </svg>
    ),
    keywords: ["table", "tabel", "grid", "baris", "kolom", "matriks"],
  },
  {
    id: "divider",
    type: "divider",
    title: "Divider",
    description: "Garis pemisah antar konten",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2.5" />
      </svg>
    ),
    keywords: ["divider", "line", "separator", "garis", "pemisah", "hr"],
  },
];

export function AdminArticleSlashMenu({
  isOpen,
  onClose,
  onSelect,
  query,
  position,
  className,
}: AdminArticleSlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const cleanQuery = query.replace(/^\//, "").toLowerCase().trim();

  const filteredItems = React.useMemo(() => {
    if (!cleanQuery) return SLASH_MENU_ITEMS;
    return SLASH_MENU_ITEMS.filter((item) => {
      return (
        item.title.toLowerCase().includes(cleanQuery) ||
        item.description.toLowerCase().includes(cleanQuery) ||
        item.keywords.some((kw) => kw.includes(cleanQuery))
      );
    });
  }, [cleanQuery]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [cleanQuery]);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          onSelect(filteredItems[selectedIndex].type);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onSelect, onClose]);

  // Click outside listener
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || filteredItems.length === 0) return null;

  return (
    <div
      ref={menuRef}
      style={
        position
          ? {
              top: `${position.top}px`,
              left: `${position.left}px`,
            }
          : undefined
      }
      className={cn(
        "z-50 w-72 max-h-80 overflow-y-auto rounded-lg bg-deep-blue-950 border border-deep-blue-700 p-1.5 shadow-none select-none animate-in fade-in zoom-in-95 duration-100",
        position ? "absolute" : "relative mt-1",
        className
      )}
    >
      <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-gray-500">
        OPSI DASAR / NOTION COMMANDS
      </div>

      <div className="space-y-0.5">
        {filteredItems.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.type)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={cn(
                "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer",
                isSelected
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center shrink-0",
                  isSelected
                    ? "bg-[#1E202E] text-white border-white/20"
                    : "bg-[#161823] text-gray-400"
                )}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-label-xs font-medium text-white truncate">
                  {item.title}
                </div>
                <div className="text-[11px] text-gray-400 truncate">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
