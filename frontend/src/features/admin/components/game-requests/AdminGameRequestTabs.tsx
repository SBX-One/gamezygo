import * as React from "react";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import type { GameRequestTab } from "../../types/admin-game-request.types";

export interface AdminGameRequestTabsProps {
  activeTab: GameRequestTab;
  onChangeTab: (tab: GameRequestTab) => void;
  className?: string;
}

const GAME_REQUEST_TABS: TabItem[] = [
  { id: "requested", label: "Requested Game" },
  { id: "accepted", label: "Accepted" },
  { id: "declined", label: "Declined" },
];

export function AdminGameRequestTabs({
  activeTab,
  onChangeTab,
  className,
}: AdminGameRequestTabsProps) {
  return (
    <Tabs
      items={GAME_REQUEST_TABS}
      activeId={activeTab}
      onChange={(id) => onChangeTab(id as GameRequestTab)}
      className={className}
    />
  );
}
