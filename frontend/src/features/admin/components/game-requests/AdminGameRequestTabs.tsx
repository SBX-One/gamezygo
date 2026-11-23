import * as React from "react";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import type { GameRequestTab } from "../../types/admin-game-request.types";

export interface AdminGameRequestTabsProps {
  activeTab: GameRequestTab;
  onChangeTab: (tab: GameRequestTab) => void;
  counts?: { requested?: number; accepted?: number; declined?: number };
  className?: string;
}

export function AdminGameRequestTabs({
  activeTab,
  onChangeTab,
  counts,
  className,
}: AdminGameRequestTabsProps) {
  const tabs: TabItem[] = [
    {
      id: "requested",
      label:
        counts?.requested !== undefined && counts.requested > 0
          ? `Requested Game (${counts.requested})`
          : "Requested Game",
    },
    {
      id: "accepted",
      label:
        counts?.accepted !== undefined && counts.accepted > 0
          ? `Accepted (${counts.accepted})`
          : "Accepted",
    },
    {
      id: "declined",
      label:
        counts?.declined !== undefined && counts.declined > 0
          ? `Declined (${counts.declined})`
          : "Declined",
    },
  ];

  return (
    <Tabs
      items={tabs}
      activeId={activeTab}
      onChange={(id) => onChangeTab(id as GameRequestTab)}
      className={className}
      orientation="responsive"
    />
  );
}
