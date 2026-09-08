import * as React from "react";
import { cn } from "@/lib/utils";
import type { TableProps, TableBoxChipProps } from "./Table.types";

/**
 * Boxed Chip element inside a table cell (e.g. for game titles in Gamezygo data tables)
 */
export function TableBoxChip({
  children,
  className,
  ref,
  ...props
}: TableBoxChipProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "border border-white/10 rounded-lg px-4.5 py-2.5 bg-white/2 text-gray-50 font-semibold text-body-sm inline-flex items-center w-fit max-w-full truncate shadow-xs",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
    </div>
  );
}

/**
 * Gamezygo Core Reusable Table Primitive
 * Matches the dark glassmorphic design system with floating header, 
 * subtle vertical dividers, and card container.
 */
export function Table<T>({
  columns,
  data,
  keyExtractor,
  className,
  headerClassName,
  bodyClassName,
  rowClassName,
  onRowClick,
  showVerticalDividers = true,
  emptyContent,
  ref,
  ...props
}: TableProps<T>) {
  // Generate synchronized grid-template-columns track definitions from column widths
  const gridTemplateColumns = React.useMemo(() => {
    return columns
      .map((col) => {
        if (!col.width) return "minmax(120px, 1fr)";

        // If already a grid track specification
        if (
          col.width.startsWith("minmax") ||
          col.width.endsWith("fr") ||
          col.width.endsWith("px") ||
          col.width.endsWith("rem")
        ) {
          return col.width;
        }

        // If Tailwind percentage width like "w-[24%]"
        const matchPct = col.width.match(/w-\[(\d+(?:\.\d+)?)%\]/);
        if (matchPct) {
          const pct = parseFloat(matchPct[1]);
          const minPx = Math.max(120, Math.round(pct * 10));
          return `minmax(${minPx}px, ${pct}fr)`;
        }

        // If Tailwind flex like "flex-[2]"
        const matchFlex = col.width.match(/flex-\[(\d+(?:\.\d+)?)\]/);
        if (matchFlex) {
          const flex = parseFloat(matchFlex[1]);
          return `minmax(${Math.round(flex * 100)}px, ${flex}fr)`;
        }

        return "minmax(120px, 1fr)";
      })
      .join(" ");
  }, [columns]);

  return (
    <div
      ref={ref}
      className={cn("w-full flex flex-col gap-3 select-none", className)}
      {...props}
    >
      <div className="w-full overflow-x-auto pb-2">
        <div className="w-fit min-w-full flex flex-col gap-3 border-t-gradient-secondary pt-8">
          {/* =========================================================================
              1. FLOATING HEADER BAR
              ========================================================================= */}
          <div
            className={cn(
              "w-full rounded-lg bg-deep-blue-900 grid items-stretch px-6",
              headerClassName
            )}
            style={{ gridTemplateColumns }}
          >
            {columns.map((col, colIdx) => {
              const isLast = colIdx === columns.length - 1;
              const alignmentClass =
                col.align === "right"
                  ? "justify-end text-right"
                  : col.align === "center"
                  ? "justify-center text-center"
                  : "justify-start text-left";

              return (
                <div
                  key={col.id || colIdx}
                  className={cn(
                    "relative min-w-0 py-3.5 px-6 font-semibold text-label-sm text-gray-100 flex items-center",
                    alignmentClass,
                    col.headerClassName
                  )}
                >
                  <span className="truncate">{col.header}</span>
                  {showVerticalDividers && !isLast && (
                    <span
                      className="absolute right-0 top-3 bottom-3 w-px bg-border-secondary-default pointer-events-none"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* =========================================================================
              2. TABLE BODY CARD CONTAINER
              ========================================================================= */}
          <div
            className={cn(
              "w-full rounded-lg bg-deep-blue-900 overflow-hidden flex flex-col p-6",
              bodyClassName
            )}
          >
            {data && data.length > 0 ? (
              data.map((item, rowIdx) => {
                const isLastRow = rowIdx === data.length - 1;
                const rowKey = keyExtractor
                  ? keyExtractor(item, rowIdx)
                  : item && typeof item === "object" && "id" in item
                  ? String((item as Record<string, unknown>).id)
                  : rowIdx;
                const customRowClass =
                  typeof rowClassName === "function"
                    ? rowClassName(item, rowIdx)
                    : rowClassName;

                return (
                  <div
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(item, rowIdx)}
                    className={cn(
                      "w-full grid items-stretch hover:bg-white/2 transition-colors duration-150",
                      !isLastRow && "border-b-gradient-secondary",
                      onRowClick && "cursor-pointer",
                      customRowClass
                    )}
                    style={{ gridTemplateColumns }}
                  >
                    {columns.map((col, colIdx) => {
                      const isLastCol = colIdx === columns.length - 1;
                      const alignmentClass =
                        col.align === "right"
                          ? "justify-end text-right"
                          : col.align === "center"
                          ? "justify-center text-center"
                          : "justify-start text-left";

                      let content: React.ReactNode;
                      if (col.cell) {
                        content = col.cell(item, rowIdx);
                      } else if (typeof col.accessor === "function") {
                        content = col.accessor(item);
                      } else if (col.accessor && typeof item === "object" && item !== null) {
                        content = (item as Record<string, unknown>)[
                          col.accessor as string
                        ] as React.ReactNode;
                      } else {
                        content = null;
                      }

                      return (
                        <div
                          key={col.id || colIdx}
                          className={cn(
                            "relative min-w-0 py-3.5 px-6 text-body-sm text-gray-300 flex items-center self-stretch",
                            alignmentClass,
                            col.className
                          )}
                        >
                          {content}
                          {showVerticalDividers && !isLastCol && (
                            <span
                              className="absolute right-0 top-3.5 bottom-3.5 w-px bg-border-secondary-default pointer-events-none"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              <div className="py-12 flex items-center justify-center text-gray-400 text-body-sm">
                {emptyContent || "Tidak ada data"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
