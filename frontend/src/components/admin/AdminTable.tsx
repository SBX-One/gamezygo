import * as React from "react";
import { cn } from "@/lib/utils";

export function AdminTable({
  className,
  children,
  ref,
  ...props
}: React.HTMLAttributes<HTMLTableElement> & { ref?: React.Ref<HTMLTableElement> }) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        ref={ref}
        className={cn("w-full text-left text-sm text-gray-300 border-collapse", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function AdminTableHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "border-b border-deep-blue-700 text-xs uppercase font-semibold text-gray-400 bg-deep-blue-900",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function AdminTableBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-deep-blue-700", className)} {...props}>
      {children}
    </tbody>
  );
}

export function AdminTableRow({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "transition-colors hover:bg-white/2",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function AdminTableHead({
  className,
  children,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("py-3.5 px-4 font-semibold text-gray-400 select-none", className)}
      {...props}
    >
      {children}
    </th>
  );
}

export function AdminTableCell({
  className,
  children,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("py-4 px-4 align-middle whitespace-nowrap", className)}
      {...props}
    >
      {children}
    </td>
  );
}
