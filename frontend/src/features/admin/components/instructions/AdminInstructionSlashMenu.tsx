import * as React from "react";
import { cn } from "@/lib/utils";
import type { InstructionBlockType } from "../../types/admin-instruction.types";

export interface InstructionSlashMenuItem {
  id: string;
  type: InstructionBlockType;
  title: string;
  description: string;
  icon: React.ReactNode;
  keywords: string[];
}

export interface AdminInstructionSlashMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: InstructionBlockType) => void;
  query: string;
  position?: { top: number; left: number };
  className?: string;
}

const SLASH_MENU_ITEMS: InstructionSlashMenuItem[] = [
  {
    id: "step",
    type: "step",
    title: "Langkah Instruksi",
    description: "Format langkah berurutan (Step 1, Step 2...)",
    icon: (
      <span className="w-5 h-5 rounded-md bg-deep-blue-800 text-indigo-400 font-bold text-[11px] flex items-center justify-center">
        1
      </span>
    ),
    keywords: ["step", "langkah", "instruksi", "tahap", "urutan"],
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
    id: "h1",
    type: "h1",
    title: "Heading 1",
    description: "Judul bagian besar",
    icon: <span className="font-bold text-label-xs text-white">H1</span>,
    keywords: ["h1", "heading", "judul", "besar", "header"],
  },
  {
    id: "h2",
    type: "h2",
    title: "Heading 2",
    description: "Judul bagian sedang",
    icon: <span className="font-bold text-label-xs text-white">H2</span>,
    keywords: ["h2", "heading", "judul", "sedang", "subjudul"],
  },
  {
    id: "h3",
    type: "h3",
    title: "Heading 3",
    description: "Subjudul bagian kecil",
    icon: <span className="font-bold text-label-xs text-white">H3</span>,
    keywords: ["h3", "heading", "subjudul", "kecil"],
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
    description: "Daftar berurutan dengan nomor biasa",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="10" y1="6" x2="21" y2="6" />
        <line x1="10" y1="12" x2="21" y2="12" />
        <line x1="10" y1="18" x2="21" y2="18" />
        <path d="M4 6h1v4M4 10h2M4 18h2.5M6 14v4" />
      </svg>
    ),
    keywords: ["number", "numbered", "list", "angka", "nomor", "ol"],
  },
  {
    id: "table",
    type: "table",
    title: "Tabel Grid",
    description: "Tabel baris & kolom interaktif",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
      </svg>
    ),
    keywords: ["table", "tabel", "grid", "kolom", "baris"],
  },
  {
    id: "callout",
    type: "callout",
    title: "Callout / Tips",
    description: "Kotak highlight info atau tips penting",
    icon: <span className="text-sm">💡</span>,
    keywords: ["callout", "note", "tip", "catatan", "peringatan", "info"],
  },
  {
    id: "image",
    type: "image",
    title: "Upload Gambar",
    description: "Unggah screenshot atau ilustrasi panduan",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    keywords: ["image", "gambar", "foto", "upload", "img", "screenshot"],
  },
  {
    id: "code",
    type: "code",
    title: "Kode / Perintah",
    description: "Blok kode atau format command text",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    keywords: ["code", "kode", "snippet", "perintah", "command"],
  },
  {
    id: "quote",
    type: "quote",
    title: "Kutipan / Quote",
    description: "Blok kutipan atau teks bergaris samping",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h2c0 4-2 6-4 8z" />
        <path d="M15 21c3 0 7-1 7-8V5c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h2c0 4-2 6-4 8z" />
      </svg>
    ),
    keywords: ["quote", "kutipan", "highlight"],
  },
  {
    id: "divider",
    type: "divider",
    title: "Garis Pembatas",
    description: "Pemisah visual horizontal antar bagian",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    ),
    keywords: ["divider", "separator", "garis", "line", "hr"],
  },
];

export function AdminInstructionSlashMenu({
  isOpen,
  onClose,
  onSelect,
  query,
  position,
  className,
}: AdminInstructionSlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Filter items based on query
  const filteredItems = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return SLASH_MENU_ITEMS;
    return SLASH_MENU_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
    );
  }, [query]);

  // Reset selected index on query change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

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

  // Keyboard navigation
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

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={
        position
          ? {
              top: `${position.top}px`,
              left: `${Math.min(position.left, 480)}px`,
            }
          : undefined
      }
      className={cn(
        "absolute z-50 w-72 max-h-72 overflow-y-auto rounded-lg bg-deep-blue-900 border border-deep-blue-700 shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-100 select-none font-sans scrollbar-thin scrollbar-thumb-deep-blue-700",
        className
      )}
    >
      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        PILIH BLOK INSTRUKSI
      </div>

      {filteredItems.length === 0 ? (
        <div className="px-3 py-3 text-label-xs text-gray-500 text-center">
          Tidak ada tipe blok yang cocok
        </div>
      ) : (
        <div className="space-y-0.5">
          {filteredItems.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.type)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-colors cursor-pointer",
                  isSelected
                    ? "bg-deep-blue-800 text-white"
                    : "text-gray-300 hover:bg-deep-blue-800/60 hover:text-white"
                )}
              >
                <div className="w-6 h-6 rounded border border-deep-blue-700 bg-deep-blue-950 flex items-center justify-center shrink-0 text-gray-300">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-label-xs font-medium text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
