import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminInstructionTableBlockProps {
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

export function AdminInstructionTableBlock({
  data = DEFAULT_TABLE,
  onChange,
  onDeleteTable,
  className,
}: AdminInstructionTableBlockProps) {
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
    if (e.key === "Tab" && !e.shiftKey) {
      if (c < numCols - 1) {
        e.preventDefault();
        focusCell(r, c + 1);
      } else if (r < numRows - 1) {
        e.preventDefault();
        focusCell(r + 1, 0);
      } else {
        // Tab at the very last cell adds a new row automatically
        e.preventDefault();
        handleAddRow();
      }
    } else if (e.key === "Tab" && e.shiftKey) {
      if (c > 0) {
        e.preventDefault();
        focusCell(r, c - 1);
      } else if (r > 0) {
        e.preventDefault();
        focusCell(r - 1, numCols - 1);
      }
    } else if (e.key === "ArrowDown" && r < numRows - 1) {
      focusCell(r + 1, c);
    } else if (e.key === "ArrowUp" && r > 0) {
      focusCell(r - 1, c);
    }
  };

  return (
    <div
      className={cn(
        "my-3 w-full overflow-x-auto select-none font-sans",
        className
      )}
    >
      <div className="inline-block min-w-full align-middle">
        <table className="w-full border-collapse border border-deep-blue-700 bg-deep-blue-900/60 rounded-lg overflow-hidden text-label-xs">
          <thead>
            <tr className="bg-deep-blue-950 border-b border-deep-blue-700">
              {tableData[0]?.map((_, colIdx) => (
                <th
                  key={`th-${colIdx}`}
                  className="p-2 border-r border-deep-blue-700 text-left relative group/col min-w-30"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400">
                    <span>Kolom {colIdx + 1}</span>
                    {numCols > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteColumn(colIdx)}
                        title="Hapus kolom ini"
                        className="opacity-0 group-hover/col:opacity-100 p-0.5 rounded text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-10 p-1 text-center bg-deep-blue-950">
                <button
                  type="button"
                  onClick={handleAddColumn}
                  title="Tambah Kolom"
                  className="p-1 rounded text-gray-400 hover:text-white hover:bg-deep-blue-800 transition-colors cursor-pointer"
                >
                  <PlusIcon />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIdx) => (
              <tr
                key={`row-${rowIdx}`}
                className="border-b border-deep-blue-700 hover:bg-deep-blue-800/20 group/row"
              >
                {row.map((cellValue, colIdx) => {
                  const key = getCellKey(rowIdx, colIdx);
                  return (
                    <td
                      key={key}
                      className="p-1.5 border-r border-deep-blue-700 relative"
                    >
                      <input
                        ref={(el) => {
                          if (el) cellRefs.current.set(key, el);
                          else cellRefs.current.delete(key);
                        }}
                        type="text"
                        value={cellValue}
                        onChange={(e) =>
                          handleCellChange(rowIdx, colIdx, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                        placeholder="..."
                        className="w-full bg-transparent px-2 py-1 text-label-xs text-gray-200 placeholder-gray-600 border-none outline-none focus:bg-deep-blue-800/40 rounded transition-colors"
                      />
                    </td>
                  );
                })}
                <td className="w-10 p-1 text-center">
                  {numRows > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(rowIdx)}
                      title="Hapus baris ini"
                      className="opacity-0 group-hover/row:opacity-100 p-1 rounded text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                    >
                      <TrashIcon />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Action Controls underneath the table */}
        <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400">
          <button
            type="button"
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-deep-blue-900 border border-deep-blue-700 hover:bg-deep-blue-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <PlusIcon />
            <span>Tambah Baris</span>
          </button>

          {onDeleteTable && (
            <button
              type="button"
              onClick={onDeleteTable}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <TrashIcon />
              <span>Hapus Tabel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
