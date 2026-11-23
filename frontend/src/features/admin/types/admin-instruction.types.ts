export interface InstructionStep {
  stepNumber: number;
  title: string;
  description: string;
}

export type InstructionBlockType =
  | "paragraph"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "bullet-list"
  | "numbered-list"
  | "step"
  | "quote"
  | "code"
  | "callout"
  | "divider"
  | "table"
  | "image";

export interface InstructionEditorBlock {
  id: string;
  type: InstructionBlockType;
  content: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrike?: boolean;
  align?: "left" | "center" | "right";
  tableData?: string[][];
  imageUrl?: string;
  imageCaption?: string;
  stepNumber?: number;
}

export interface InstructionTemplate {
  id: string;
  title: string;
  badge: "Listed" | "Draft" | "Archived";
  createdAt: string;
  lastEdit: string;
  steps: InstructionStep[];
  blocks?: InstructionEditorBlock[];
  content?: string;
}

export interface AdminInstructionFilterState {
  searchQuery: string;
  status?: string;
}

