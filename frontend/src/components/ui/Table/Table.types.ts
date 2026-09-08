import * as React from "react";

export interface TableColumn<T> {
  id: string;
  header: React.ReactNode;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T, index: number) => React.ReactNode;
  /** Width style or tailwind class e.g. "flex-[2.2]" or "w-[24%]" */
  width?: string;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
}

export interface TableProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor?: (item: T, index: number) => string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  onRowClick?: (item: T, index: number) => void;
  showVerticalDividers?: boolean;
  emptyContent?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}

export interface TableBoxChipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}
