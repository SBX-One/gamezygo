import type { ReactNode } from "react";

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  badge?: ReactNode;
}

export interface AdminNavSection {
  id: string;
  title: string;
  items: AdminNavItem[];
}

export interface AdminSidebarProps {
  sections?: AdminNavSection[];
  activeId?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export interface AdminHeaderProps {
  title?: ReactNode;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  headerRight?: ReactNode;
  className?: string;
}

export interface AdminLayoutProps {
  children: ReactNode;
  title?: ReactNode;
  activeNavId?: string;
  headerRight?: ReactNode;
  className?: string;
  headerClassName?: string;
  isError?: boolean;
  hasError?: boolean;
  onReload?: () => void;
  errorTitle?: string;
  errorDescription?: string;
}
