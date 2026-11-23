import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminCatalogActionButtonsProps {
  onViewArchived?: () => void;
  onEditProductSection?: () => void;
  onPoManagement?: () => void;
  viewArchivedLabel?: string;
  activeButton?: "archived" | "section" | "po" | null;
  className?: string;
}

export function AdminCatalogActionButtons({
  onViewArchived,
  onEditProductSection,
  onPoManagement,
  viewArchivedLabel = "View Archived Product",
  activeButton,
  className,
}: AdminCatalogActionButtonsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Button
        variant={activeButton === "archived" ? "active" : "inactive"}
        size="sm"
        onClick={onViewArchived}
        className="font-medium"
      >
        {viewArchivedLabel}
      </Button>

      <Button
        variant={activeButton === "section" ? "active" : "inactive"}
        size="sm"
        onClick={onEditProductSection}
        className="font-medium"
      >
        Edit Product Section
      </Button>

      <Button
        variant={activeButton === "po" ? "active" : "inactive"}
        size="sm"
        onClick={onPoManagement}
        className="font-medium"
      >
        PO Management
      </Button>
    </div>
  );
}
