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
  title?: string;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  headerRight?: ReactNode;
  className?: string;
}

export interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  activeNavId?: string;
  className?: string;
}
