import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface AdminCatalogActionButtonsProps {
  onViewArchived?: () => void;
  onEditProductSection?: () => void;
  onPoManagement?: () => void;
  className?: string;
}

export function AdminCatalogActionButtons({
  onViewArchived,
  onEditProductSection,
  onPoManagement,
  className,
}: AdminCatalogActionButtonsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Button
        variant="inactive"
        size="sm"
        onClick={onViewArchived}
        className="font-medium"
      >
        View Archived Product
      </Button>

      <Button
        variant="inactive"
        size="sm"
        onClick={onEditProductSection}
        className="font-medium"
      >
        Edit Product Section
      </Button>

      <Button
        variant="inactive"
        size="sm"
        onClick={onPoManagement}
        className="font-medium"
      >
        PO Management
      </Button>
    </div>
  );
}
