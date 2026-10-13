import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminArticleTableBlockProps {
  data?: string[][];
  onChange: (newData: string[][]) => void;
  onDeleteTable?: () => void;
  className?: string;
}

const DEFAULT_TABLE: string[][] = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export function AdminArticleTableBlock({
  data = DEFAULT_TABLE,
  onChange,
  onDeleteTable,
  className,
}: AdminArticleTableBlockProps) {
  const tableData = data && data.length > 0 ? data : DEFAULT_TABLE;
  const numRows = tableData.length;
  const numCols = tableData[0]?.length || 3;

  const cellRefs = React.useRef<Map<string, HTMLInputElement>>(new Map());

  const getCellKey = (r: number, c: number) => `${r}-${c}`;

  const focusCell = (r: number, c: number) => {
    setTimeout(() => {
      const el = cellRefs.current.get(getCellKey(r, c));
      el?.focus();
    }, 30);
  };

  const handleCellChange = (r: number, c: number, value: string) => {
    const updated = tableData.map((row, rowIdx) =>
      rowIdx === r
        ? row.map((cell, colIdx) => (colIdx === c ? value : cell))
        : [...row]
    );
    onChange(updated);
  };

  const handleAddRow = () => {
    const newRow = new Array(numCols).fill("");
    const updated = [...tableData, newRow];
    onChange(updated);
    focusCell(numRows, 0);
  };

  const handleAddColumn = () => {
    const updated = tableData.map((row) => [...row, ""]);
    onChange(updated);
  };

  const handleDeleteRow = (r: number) => {
    if (numRows <= 1) return;
    const updated = tableData.filter((_, idx) => idx !== r);
    onChange(updated);
  };

  const handleDeleteColumn = (c: number) => {
    if (numCols <= 1) return;
    const updated = tableData.map((row) => row.filter((_, idx) => idx !== c));
    onChange(updated);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    r: number,
    c: number
  ) => {
    if (e.key === "Tab") {
      if (!e.shiftKey) {
        // Tab next
        if (c < numCols - 1) {
          e.preventDefault();
          focusCell(r, c + 1);
        } else if (r < numRows - 1) {
          e.preventDefault();
          focusCell(r + 1, 0);
        } else {
          // In the last cell, Tab creates a new row!
          e.preventDefault();
          handleAddRow();
        }
      } else {
        // Shift + Tab previous
        if (c > 0) {
          e.preventDefault();
          focusCell(r, c - 1);
        } else if (r > 0) {
          e.preventDefault();
          focusCell(r - 1, numCols - 1);
        }
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (r < numRows - 1) {
        focusCell(r + 1, c);
      } else {
        handleAddRow();
      }
    } else if (e.key === "ArrowUp" && r > 0) {
      focusCell(r - 1, c);
    } else if (e.key === "ArrowDown" && r < numRows - 1) {
      focusCell(r + 1, c);
    }
  };

  return (
    <div className={cn("w-full my-4 group/table select-none font-sans", className)}>
      {/* Table Toolbar Header (Hover Actions: Add Col, Add Row, Delete Table) */}
      <div className="flex items-center justify-between pb-1.5 text-xs text-gray-500 opacity-0 group-hover/table:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#161823] hover:bg-[#1E202E] border border-white/10 text-[11px] text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <PlusIcon />
            <span>Tambah Baris</span>
          </button>
          <button
            type="button"
            onClick={handleAddColumn}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#161823] hover:bg-[#1E202E] border border-white/10 text-[11px] text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <PlusIcon />
            <span>Tambah Kolom</span>
          </button>
        </div>

        {onDeleteTable && (
          <button
            type="button"
            onClick={onDeleteTable}
            className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 text-[11px] transition-colors cursor-pointer"
          >
            <TrashIcon />
            <span>Hapus Tabel</span>
          </button>
        )}
      </div>

      {/* Main Grid Table (Exact Match with Image 1: 3x3 dark grid with clean borders) */}
      <div className="relative w-full overflow-x-auto rounded-lg border border-[#2F3241] bg-[#12131C] shadow-none">
        <table className="w-full border-collapse table-fixed">
          <tbody>
            {tableData.map((row, rIdx) => (
              <tr key={`row-${rIdx}`} className="group/row">
                {row.map((cellValue, cIdx) => {
                  const key = getCellKey(rIdx, cIdx);
                  const isLastRow = rIdx === numRows - 1;
                  const isLastCol = cIdx === numCols - 1;

                  return (
                    <td
                      key={key}
                      className={cn(
                        "p-0 h-10 min-w-35 bg-transparent transition-colors focus-within:bg-white/4",
                        !isLastCol && "border-r border-[#2F3241]",
                        !isLastRow && "border-b border-[#2F3241]"
                      )}
                    >
                      <input
                        ref={(el) => {
                          if (el) cellRefs.current.set(key, el);
                          else cellRefs.current.delete(key);
                        }}
                        type="text"
                        value={cellValue}
                        onChange={(e) =>
                          handleCellChange(rIdx, cIdx, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, rIdx, cIdx)}
                        placeholder=""
                        className="w-full h-full px-3.5 py-2.5 bg-transparent border-none outline-none font-sans text-sm text-gray-200 placeholder-transparent focus:placeholder-gray-600 tracking-normal"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Helper text */}
      <div className="flex items-center justify-between pt-1.5 text-[11px] text-gray-500">
        <span>Tekan <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">Tab</kbd> untuk pindah kolom / tambah baris otomatis</span>
        <span>{numRows} Baris × {numCols} Kolom</span>
      </div>
    </div>
  );
}
