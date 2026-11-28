import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AdminArticleSlashMenu } from "./AdminArticleSlashMenu";
import { AdminArticleTableBlock } from "./AdminArticleTableBlock";
import { parseMarkdownToArticleBlocks } from "../../utils/article-content.utils";
import type {
  ArticleBlockType,
  ArticleEditorBlock,
} from "../../types/admin-article.types";

export interface AdminArticleBlockEditorProps {
  title: string;
  onTitleChange: (title: string) => void;
  blocks: ArticleEditorBlock[];
  onBlocksChange: (blocks: ArticleEditorBlock[]) => void;
  activeBlockId: string | null;
  onActiveBlockChange: (id: string | null) => void;
  zoom?: number;
  hideTitle?: boolean;
  className?: string;
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const GripVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="9" cy="12" r="1.2" fill="currentColor" />
    <circle cx="9" cy="5" r="1.2" fill="currentColor" />
    <circle cx="9" cy="19" r="1.2" fill="currentColor" />
    <circle cx="15" cy="12" r="1.2" fill="currentColor" />
    <circle cx="15" cy="5" r="1.2" fill="currentColor" />
    <circle cx="15" cy="19" r="1.2" fill="currentColor" />
  </svg>
);

const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export function AdminArticleBlockEditor({
  title,
  onTitleChange,
  blocks,
  onBlocksChange,
  activeBlockId,
  onActiveBlockChange,
  zoom = 100,
  hideTitle = false,
  className,
}: AdminArticleBlockEditorProps) {
  // Slash command menu state
  const [slashMenuState, setSlashMenuState] = React.useState<{
    isOpen: boolean;
    blockId: string | null;
    query: string;
    position?: { top: number; left: number };
  }>({
    isOpen: false,
    blockId: null,
    query: "",
  });

  // Drag and drop state for swapping sections
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const blockRefs = React.useRef<Map<string, HTMLTextAreaElement | HTMLInputElement>>(
    new Map()
  );

  // Auto-resize textarea to fit content without scrollbars
  const autoResizeTextarea = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  // Auto-focus helper
  const focusBlock = (id: string, selectStart = false) => {
    setTimeout(() => {
      const el = blockRefs.current.get(id);
      if (el) {
        el.focus();
        if (selectStart && "setSelectionRange" in el) {
          el.setSelectionRange(0, 0);
        }
        onActiveBlockChange(id);
        if (el instanceof HTMLTextAreaElement) {
          autoResizeTextarea(el);
        }
      }
    }, 40);
  };

  // Title Enter Handler: Pressing Enter on Title automatically creates or focuses first section!
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (blocks.length === 0) {
        const newBlock: ArticleEditorBlock = {
          id: `blk-${Date.now()}`,
          type: "paragraph",
          content: "",
        };
        onBlocksChange([newBlock]);
        focusBlock(newBlock.id);
      } else {
        const firstBlock = blocks[0];
        if (!firstBlock.content.trim()) {
          focusBlock(firstBlock.id);
        } else {
          // Insert empty block at the top if first block already has content
          const newBlock: ArticleEditorBlock = {
            id: `blk-${Date.now()}`,
            type: "paragraph",
            content: "",
          };
          onBlocksChange([newBlock, ...blocks]);
          focusBlock(newBlock.id);
        }
      }
    }
  };

  // Block Content Change handler
  const handleBlockContentChange = (
    id: string,
    value: string,
    e?: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e?.target instanceof HTMLTextAreaElement) {
      autoResizeTextarea(e.target);
    }

    // Check if slash command was initiated
    if (value.startsWith("/") || value.includes(" /")) {
      const match = value.match(/(?:^|\s)\/([a-zA-Z0-9]*)$/);
      if (match) {
        const query = match[1] || "";
        const targetEl = e?.target as HTMLElement | undefined;
        setSlashMenuState({
          isOpen: true,
          blockId: id,
          query,
          position: targetEl
            ? {
                top: targetEl.offsetTop + 32,
                left: targetEl.offsetLeft,
              }
            : undefined,
        });
      } else {
        setSlashMenuState((prev) => ({ ...prev, isOpen: false }));
      }
    } else if (slashMenuState.isOpen && slashMenuState.blockId === id) {
      setSlashMenuState((prev) => ({ ...prev, isOpen: false }));
    }

    const currentBlock = blocks.find((b) => b.id === id);

    // Live Markdown block shortcuts when typing at the start of a paragraph block
    if (currentBlock?.type === "paragraph") {
      const headingShortcut = value.match(/^(#{1,4})\s(.*)$/);
      if (headingShortcut) {
        const level = headingShortcut[1].length as 1 | 2 | 3 | 4;
        const rest = headingShortcut[2];
        setSlashMenuState((prev) => ({ ...prev, isOpen: false }));
        onBlocksChange(
          blocks.map((b) =>
            b.id === id
              ? { ...b, type: `h${level}` as ArticleBlockType, content: rest }
              : b
          )
        );
        focusBlock(id);
        return;
      }

      const bulletShortcut = value.match(/^[-*+]\s(.*)$/);
      if (bulletShortcut) {
        setSlashMenuState((prev) => ({ ...prev, isOpen: false }));
        onBlocksChange(
          blocks.map((b) =>
            b.id === id
              ? { ...b, type: "bullet-list", content: bulletShortcut[1] }
              : b
          )
        );
        focusBlock(id);
        return;
      }

      const numberedShortcut = value.match(/^\d+[.)]\s(.*)$/);
      if (numberedShortcut) {
        setSlashMenuState((prev) => ({ ...prev, isOpen: false }));
        onBlocksChange(
          blocks.map((b) =>
            b.id === id
              ? { ...b, type: "numbered-list", content: numberedShortcut[1] }
              : b
          )
        );
        focusBlock(id);
        return;
      }

      const quoteShortcut = value.match(/^>\s(.*)$/);
      if (quoteShortcut) {
        setSlashMenuState((prev) => ({ ...prev, isOpen: false }));
        onBlocksChange(
          blocks.map((b) =>
            b.id === id ? { ...b, type: "quote", content: quoteShortcut[1] } : b
          )
        );
        focusBlock(id);
        return;
      }

      if (value === "```") {
        setSlashMenuState((prev) => ({ ...prev, isOpen: false }));
        onBlocksChange(
          blocks.map((b) =>
            b.id === id ? { ...b, type: "code", content: "" } : b
          )
        );
        focusBlock(id);
        return;
      }

      if (value === "---") {
        const idx = blocks.findIndex((b) => b.id === id);
        const nextBlock: ArticleEditorBlock = {
          id: `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: "paragraph",
          content: "",
        };
        setSlashMenuState((prev) => ({ ...prev, isOpen: false }));
        const updated = [
          ...blocks.slice(0, idx),
          { ...currentBlock, type: "divider" as ArticleBlockType, content: "" },
          nextBlock,
          ...blocks.slice(idx + 1),
        ];
        onBlocksChange(updated);
        focusBlock(nextBlock.id);
        return;
      }
    }

    onBlocksChange(
      blocks.map((b) => (b.id === id ? { ...b, content: value } : b))
    );
  };

  // Multi-line Markdown paste support on paragraph blocks
  const handleParagraphPaste = (
    e: React.ClipboardEvent<HTMLTextAreaElement>,
    index: number,
    block: ArticleEditorBlock
  ) => {
    const pasted = e.clipboardData?.getData("text/plain") || "";
    const hasMultilineOrMd =
      pasted.includes("\n") ||
      /^(#{1,4}\s|[-*+]\s|\d+[.)]\s|>\s|```|---)/m.test(pasted);
    if (!hasMultilineOrMd) return;

    const parsedBlocks = parseMarkdownToArticleBlocks(pasted);
    if (parsedBlocks.length === 0) return;

    e.preventDefault();
    const prefix = block.content.trim();
    const inserted =
      prefix && parsedBlocks[0].type === "paragraph"
        ? [
            { ...parsedBlocks[0], content: `${prefix} ${parsedBlocks[0].content}` },
            ...parsedBlocks.slice(1),
          ]
        : prefix
        ? [{ ...block }, ...parsedBlocks]
        : parsedBlocks;

    const updated = [
      ...blocks.slice(0, index),
      ...inserted,
      ...blocks.slice(index + 1),
    ];
    onBlocksChange(updated);
    const lastInserted = inserted[inserted.length - 1];
    if (lastInserted) {
      focusBlock(lastInserted.id);
    }
  };

  // Key Down Handler: Seamless Enter to create new section + Backspace to remove
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number,
    block: ArticleEditorBlock
  ) => {
    if (slashMenuState.isOpen) {
      // Let slash menu handle Arrow keys, Enter, and Escape
      if (["ArrowUp", "ArrowDown", "Enter", "Escape"].includes(e.key)) {
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // If empty list item, pressing Enter turns it into a normal paragraph
      if (
        (block.type === "bullet-list" || block.type === "numbered-list") &&
        block.content.trim() === ""
      ) {
        onBlocksChange(
          blocks.map((b) => (b.id === block.id ? { ...b, type: "paragraph" } : b))
        );
        return;
      }

      // Calculate split text position at cursor
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const cursorPos = target.selectionStart ?? block.content.length;
      const contentBefore = block.content.slice(0, cursorPos);
      const contentAfter = block.content.slice(cursorPos);

      // In Notion, list keeps list type; all other headings/quotes create normal paragraph below
      const nextType: ArticleBlockType =
        block.type === "bullet-list"
          ? "bullet-list"
          : block.type === "numbered-list"
          ? "numbered-list"
          : "paragraph";

      const newBlock: ArticleEditorBlock = {
        id: `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: nextType,
        content: contentAfter,
      };

      const updated = [...blocks];
      updated[index] = { ...block, content: contentBefore };
      updated.splice(index + 1, 0, newBlock);

      onBlocksChange(updated);
      focusBlock(newBlock.id);
    } else if (
      e.key === "Backspace" &&
      block.content === "" &&
      blocks.length > 1
    ) {
      e.preventDefault();

      // If non-paragraph empty block, revert to paragraph first
      if (block.type !== "paragraph") {
        onBlocksChange(
          blocks.map((b) => (b.id === block.id ? { ...b, type: "paragraph" } : b))
        );
        return;
      }

      // Delete current block and focus previous block
      const updated = blocks.filter((b) => b.id !== block.id);
      onBlocksChange(updated);
      const prevBlock = blocks[index - 1] || blocks[index + 1];
      if (prevBlock) focusBlock(prevBlock.id);
    }
  };

  // Slash Menu Selection handler
  const handleSlashSelect = (type: ArticleBlockType) => {
    if (!slashMenuState.blockId) return;
    const targetId = slashMenuState.blockId;

    if (type === "divider") {
      const newBlock: ArticleEditorBlock = {
        id: `blk-${Date.now()}-p`,
        type: "paragraph",
        content: "",
      };
      const updated: ArticleEditorBlock[] = [];
      for (const b of blocks) {
        if (b.id === targetId) {
          updated.push({ ...b, type: "divider", content: "" });
          updated.push(newBlock);
        } else {
          updated.push(b);
        }
      }
      onBlocksChange(updated);
      focusBlock(newBlock.id);
    } else if (type === "image") {
      onBlocksChange(
        blocks.map((b) =>
          b.id === targetId
            ? {
                ...b,
                type: "image",
                content: "",
                imageUrl: "",
                imageCaption: "",
              }
            : b
        )
      );
    } else if (type === "table") {
      onBlocksChange(
        blocks.map((b) =>
          b.id === targetId
            ? {
                ...b,
                type: "table",
                content: "",
                tableData: [
                  ["", "", ""],
                  ["", "", ""],
                  ["", "", ""],
                ],
              }
            : b
        )
      );
    } else {
      onBlocksChange(
        blocks.map((b) =>
          b.id === targetId
            ? {
                ...b,
                type,
                content: b.content.replace(/(?:^|\s)\/[a-zA-Z0-9]*$/, "").trim(),
              }
            : b
        )
      );
      focusBlock(targetId);
    }

    setSlashMenuState({ isOpen: false, blockId: null, query: "" });
  };

  const handleImageUpload = (
    blockId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const applyImageUrl = (dataUrl: string) => {
      onBlocksChange(
        blocks.map((b) =>
          b.id === blockId ? { ...b, imageUrl: dataUrl } : b
        )
      );
    };

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const rawDataUrl = reader.result;

      // Compress & resize via offscreen canvas so HTML content payload stays within DB/server limits
      const img = new window.Image();
      img.onload = () => {
        try {
          const maxWidth = 960;
          const scale = img.width > maxWidth ? maxWidth / img.width : 1;
          const targetW = Math.max(1, Math.round(img.width * scale));
          const targetH = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, targetW, targetH);
            const compressed = canvas.toDataURL("image/jpeg", 0.72);
            applyImageUrl(
              compressed.length < rawDataUrl.length ? compressed : rawDataUrl
            );
            return;
          }
        } catch {
          // Fallback to original data URL if canvas fails
        }
        applyImageUrl(rawDataUrl);
      };
      img.onerror = () => applyImageUrl(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      onBlocksChange([{ id: `blk-${Date.now()}`, type: "paragraph", content: "" }]);
      return;
    }
    onBlocksChange(blocks.filter((b) => b.id !== id));
  };

  const handleAddBlockBelow = (index: number) => {
    const newBlock: ArticleEditorBlock = {
      id: `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "paragraph",
      content: "",
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, newBlock);
    onBlocksChange(updated);
    focusBlock(newBlock.id);
  };

  // Section Swap / Move Handler (Up or Down)
  const handleMoveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocks.length || fromIndex === toIndex) return;
    const updated = [...blocks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onBlocksChange(updated);
    focusBlock(moved.id);
  };

  // Drag and Drop handlers for swapping sections
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      handleMoveBlock(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Canvas click helper: Clicking empty space at bottom automatically focuses or adds section
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (blocks.length === 0) {
        handleAddBlockBelow(-1);
      } else {
        const last = blocks[blocks.length - 1];
        if (last.content.trim()) {
          handleAddBlockBelow(blocks.length - 1);
        } else {
          focusBlock(last.id);
        }
      }
    }
  };

  return (
    <div
      style={{
        transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
        transformOrigin: "top center",
      }}
      onClick={handleCanvasClick}
      className={cn(
        "w-full transition-transform duration-150 pl-0 md:pl-14 lg:pl-16 relative font-sans",
        className
      )}
    >
      {/* 1. Article Title Header: "Hello World!" (Matching Image 5) */}
      {!hideTitle && (
        <div className="mb-6 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            placeholder="Hello World!"
            className="w-full p-0 m-0 text-3xl sm:text-4xl font-bold font-sans text-white placeholder-gray-600 bg-transparent border-none outline-none tracking-tight transition-colors"
          />
        </div>
      )}

      {/* 2. Interactive Blocks List (Flush with Title, actions in left gutter) */}
      <div className="space-y-3 relative font-sans">
        {blocks.map((block, index) => {
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={block.id}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={cn(
                "group relative w-full flex flex-col md:flex-row md:items-start transition-all rounded-lg font-sans",
                isDragOver && "border-t-2 border-[#DF3848] pt-1"
              )}
            >
              {/* Block Content by Type: Starts at x=0 flush with Title */}
              <div className="w-full min-w-0 font-sans">
                {/* Paragraph */}
                {block.type === "paragraph" && (
                  <textarea
                    ref={(el) => {
                      if (el) {
                        blockRefs.current.set(block.id, el);
                        autoResizeTextarea(el);
                      } else {
                        blockRefs.current.delete(block.id);
                      }
                    }}
                    value={block.content}
                    onChange={(e) =>
                      handleBlockContentChange(block.id, e.target.value, e)
                    }
                    onFocus={() => onActiveBlockChange(block.id)}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    onPaste={(e) => handleParagraphPaste(e, index, block)}
                    placeholder={
                      index === 0 && blocks.length === 1
                        ? "Mulai buat instruksi... (mendukung Markdown: #, -, 1., >, **tebal**, *miring*)"
                        : "Ketik '/' untuk opsi atau gunakan Markdown (#, -, 1.)..."
                    }
                    rows={1}
                    className={cn(
                      "w-full p-0 m-0 bg-transparent resize-none border-none outline-none font-sans text-sm sm:text-base text-gray-200 placeholder-gray-600 leading-relaxed overflow-hidden block",
                      block.align === "center" && "text-center",
                      block.align === "right" && "text-right",
                      block.isBold && "font-bold",
                      block.isItalic && "italic",
                      block.isUnderline && "underline",
                      block.isStrike && "line-through"
                    )}
                  />
                )}

                {/* Heading 1 */}
                {block.type === "h1" && (
                  <input
                    ref={(el) => {
                      if (el) blockRefs.current.set(block.id, el);
                      else blockRefs.current.delete(block.id);
                    }}
                    type="text"
                    value={block.content}
                    onChange={(e) =>
                      handleBlockContentChange(block.id, e.target.value, e)
                    }
                    onFocus={() => onActiveBlockChange(block.id)}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    placeholder="Heading 1..."
                    className={cn(
                      "w-full p-0 m-0 bg-transparent border-none outline-none font-sans text-2xl sm:text-3xl font-bold text-white placeholder-gray-600 tracking-tight block",
                      block.align === "center" && "text-center",
                      block.align === "right" && "text-right"
                    )}
                  />
                )}

                {/* Heading 2 */}
                {block.type === "h2" && (
                  <input
                    ref={(el) => {
                      if (el) blockRefs.current.set(block.id, el);
                      else blockRefs.current.delete(block.id);
                    }}
                    type="text"
                    value={block.content}
                    onChange={(e) =>
                      handleBlockContentChange(block.id, e.target.value, e)
                    }
                    onFocus={() => onActiveBlockChange(block.id)}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    placeholder="Heading 2..."
                    className={cn(
                      "w-full p-0 m-0 bg-transparent border-none outline-none font-sans text-xl sm:text-2xl font-semibold text-white placeholder-gray-600 tracking-tight block",
                      block.align === "center" && "text-center",
                      block.align === "right" && "text-right"
                    )}
                  />
                )}

                {/* Heading 3 */}
                {block.type === "h3" && (
                  <input
                    ref={(el) => {
                      if (el) blockRefs.current.set(block.id, el);
                      else blockRefs.current.delete(block.id);
                    }}
                    type="text"
                    value={block.content}
                    onChange={(e) =>
                      handleBlockContentChange(block.id, e.target.value, e)
                    }
                    onFocus={() => onActiveBlockChange(block.id)}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    placeholder="Heading 3..."
                    className={cn(
                      "w-full p-0 m-0 bg-transparent border-none outline-none font-sans text-lg sm:text-xl font-semibold text-white placeholder-gray-600 block",
                      block.align === "center" && "text-center",
                      block.align === "right" && "text-right"
                    )}
                  />
                )}

                {/* Heading 4 */}
                {block.type === "h4" && (
                  <input
                    ref={(el) => {
                      if (el) blockRefs.current.set(block.id, el);
                      else blockRefs.current.delete(block.id);
                    }}
                    type="text"
                    value={block.content}
                    onChange={(e) =>
                      handleBlockContentChange(block.id, e.target.value, e)
                    }
                    onFocus={() => onActiveBlockChange(block.id)}
                    onKeyDown={(e) => handleKeyDown(e, index, block)}
                    placeholder="Heading 4..."
                    className={cn(
                      "w-full p-0 m-0 bg-transparent border-none outline-none font-sans text-base font-semibold text-white placeholder-gray-600 block",
                      block.align === "center" && "text-center",
                      block.align === "right" && "text-right"
                    )}
                  />
                )}

                {/* Bullet List */}
                {block.type === "bullet-list" && (
                  <div className="flex items-start gap-2.5 w-full font-sans">
                    <span className="text-gray-400 pt-0.5 select-none font-bold shrink-0">
                      •
                    </span>
                    <input
                      ref={(el) => {
                        if (el) blockRefs.current.set(block.id, el);
                        else blockRefs.current.delete(block.id);
                      }}
                      type="text"
                      value={block.content}
                      onChange={(e) =>
                        handleBlockContentChange(block.id, e.target.value, e)
                      }
                      onFocus={() => onActiveBlockChange(block.id)}
                      onKeyDown={(e) => handleKeyDown(e, index, block)}
                      placeholder="Daftar poin..."
                      className="w-full p-0 m-0 bg-transparent border-none outline-none font-sans text-sm sm:text-base text-gray-200 placeholder-gray-600"
                    />
                  </div>
                )}

                {/* Numbered List */}
                {block.type === "numbered-list" && (
                  <div className="flex items-start gap-2 w-full font-sans">
                    <span className="text-label-xs font-semibold text-gray-400 pt-1 select-none shrink-0">
                      {index + 1}.
                    </span>
                    <input
                      ref={(el) => {
                        if (el) blockRefs.current.set(block.id, el);
                        else blockRefs.current.delete(block.id);
                      }}
                      type="text"
                      value={block.content}
                      onChange={(e) =>
                        handleBlockContentChange(block.id, e.target.value, e)
                      }
                      onFocus={() => onActiveBlockChange(block.id)}
                      onKeyDown={(e) => handleKeyDown(e, index, block)}
                      placeholder="Daftar langkah..."
                      className="w-full p-0 m-0 bg-transparent border-none outline-none font-sans text-sm sm:text-base text-gray-200 placeholder-gray-600"
                    />
                  </div>
                )}

                {/* Image Block */}
                {block.type === "image" && (
                  <div className="my-3 space-y-2 w-full">
                    {block.imageUrl ? (
                      <div className="relative rounded-lg overflow-hidden border border-white/10 group/img max-h-115">
                        <Image
                          src={block.imageUrl}
                          alt={block.imageCaption || "Gambar konten artikel"}
                          width={1200}
                          height={600}
                          unoptimized
                          className="w-full h-auto max-h-115 object-cover rounded-lg"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                          <label className="px-3 py-1.5 rounded-lg bg-deep-blue-950/85 hover:bg-deep-blue-950 border border-white/20 text-label-xs font-medium text-white cursor-pointer backdrop-blur-md">
                            Ganti Gambar
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(block.id, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      /* Empty Image Upload Box */
                      <div className="p-8 border-2 border-dashed border-[#2F3241] rounded-lg bg-deep-blue-900 flex flex-col items-center justify-center gap-3">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <div className="text-center space-y-1">
                          <p className="text-label-xs font-medium text-gray-300">
                            Unggah Gambar Konten
                          </p>
                          <p className="text-[11px] text-gray-500">
                            PNG, JPG, WebP hingga 10MB
                          </p>
                        </div>
                        <label className="px-4 py-2 rounded-lg bg-deep-blue-900 hover:bg-[#222534] border border-white/10 text-label-xs font-medium text-white cursor-pointer transition-colors">
                          Pilih File Gambar
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(block.id, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}

                    {/* Image Caption */}
                    <input
                      type="text"
                      value={block.imageCaption || ""}
                      onChange={(e) =>
                        onBlocksChange(
                          blocks.map((b) =>
                            b.id === block.id
                              ? { ...b, imageCaption: e.target.value }
                              : b
                          )
                        )
                      }
                      placeholder="Tambahkan keterangan / caption gambar..."
                      className="w-full text-center font-sans text-label-xs text-gray-400 placeholder-gray-600 bg-transparent border-none outline-none"
                    />
                  </div>
                )}

                {/* Quote */}
                {block.type === "quote" && (
                  <div className="border-l-4 border-[#DF3848] pl-4 my-2 w-full font-sans">
                    <textarea
                      ref={(el) => {
                        if (el) {
                          blockRefs.current.set(block.id, el);
                          autoResizeTextarea(el);
                        } else {
                          blockRefs.current.delete(block.id);
                        }
                      }}
                      value={block.content}
                      onChange={(e) =>
                        handleBlockContentChange(block.id, e.target.value, e)
                      }
                      onFocus={() => onActiveBlockChange(block.id)}
                      onKeyDown={(e) => handleKeyDown(e, index, block)}
                      placeholder="Tulis kutipan atau highlight kalimat..."
                      rows={1}
                      className="w-full p-0 m-0 bg-transparent resize-none border-none outline-none italic font-sans text-sm sm:text-base text-gray-300 placeholder-gray-600 leading-relaxed overflow-hidden block"
                    />
                  </div>
                )}

                {/* Code Block */}
                {block.type === "code" && (
                  <div className="p-3.5 rounded-lg bg-deep-blue-950 border border-white/10 font-mono my-2 w-full">
                    <textarea
                      ref={(el) => {
                        if (el) {
                          blockRefs.current.set(block.id, el);
                          autoResizeTextarea(el);
                        } else {
                          blockRefs.current.delete(block.id);
                        }
                      }}
                      value={block.content}
                      onChange={(e) =>
                        handleBlockContentChange(block.id, e.target.value, e)
                      }
                      onFocus={() => onActiveBlockChange(block.id)}
                      onKeyDown={(e) => handleKeyDown(e, index, block)}
                      placeholder="// Tulis kode atau snippet di sini..."
                      rows={3}
                      className="w-full p-0 m-0 bg-transparent resize-none border-none outline-none text-label-xs sm:text-sm text-indigo-300 placeholder-gray-600 leading-relaxed font-mono block"
                    />
                  </div>
                )}

                {/* Callout */}
                {block.type === "callout" && (
                  <div className="p-3.5 rounded-lg bg-[#151722] border border-indigo-500/30 flex items-start gap-3 my-2 w-full font-sans">
                    <span className="text-base select-none shrink-0">💡</span>
                    <textarea
                      ref={(el) => {
                        if (el) {
                          blockRefs.current.set(block.id, el);
                          autoResizeTextarea(el);
                        } else {
                          blockRefs.current.delete(block.id);
                        }
                      }}
                      value={block.content}
                      onChange={(e) =>
                        handleBlockContentChange(block.id, e.target.value, e)
                      }
                      onFocus={() => onActiveBlockChange(block.id)}
                      onKeyDown={(e) => handleKeyDown(e, index, block)}
                      placeholder="Kotak info / catatan penting..."
                      rows={1}
                      className="w-full p-0 m-0 bg-transparent resize-none border-none outline-none font-sans text-label-xs sm:text-sm text-gray-200 placeholder-gray-500 leading-relaxed overflow-hidden block"
                    />
                  </div>
                )}

                {/* Divider */}
                {block.type === "divider" && (
                  <div className="py-2 w-full">
                    <hr className="border-t border-white/10" />
                  </div>
                )}

                {/* Table Block (Matching Image 1: 3x3 dark grid with clean borders) */}
                {block.type === "table" && (
                  <AdminArticleTableBlock
                    data={block.tableData}
                    onChange={(newData) =>
                      onBlocksChange(
                        blocks.map((b) =>
                          b.id === block.id ? { ...b, tableData: newData } : b
                        )
                      )
                    }
                    onDeleteTable={() => handleDeleteBlock(block.id)}
                  />
                )}
              </div>

              {/* Action Controls: Grip (drag) + Plus (add) + Trash (delete)
                  - Mobile/Tablet (< md): Positioned cleanly underneath the content block (Gambar 3 improvement)
                  - Desktop (>= md): Positioned in left gutter outside the text column */}
              <div
                className={cn(
                  "select-none transition-all z-20",
                  // Desktop: Left Gutter outside the text column
                  "md:absolute md:right-full md:mr-3.5 md:top-0.5 md:opacity-0 md:group-hover:opacity-100 md:flex md:items-center md:gap-1",
                  // Mobile: Positioned underneath content so it never squishes or disrupts text flow (Gambar 3)
                  "mt-2 pt-1 border-t border-white/5 flex items-center gap-1.5 md:border-none md:mt-0 md:pt-0",
                  block.id !== activeBlockId && "hidden md:flex"
                )}
              >
                {/* 1. Drag & Drop Reorder Grip Handle (Tukar Section) */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  title="Drag untuk menukar urutan section"
                  className="p-1.5 md:p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-grab active:cursor-grabbing transition-colors"
                >
                  <GripVerticalIcon />
                </div>

                {/* 2. Add Section Below (+) */}
                <button
                  type="button"
                  onClick={() => handleAddBlockBelow(index)}
                  title="Tambah section baru di bawah"
                  className="p-1.5 md:p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <PlusIcon />
                </button>

                {/* 3. Delete Section */}
                <button
                  type="button"
                  onClick={() => handleDeleteBlock(block.id)}
                  title="Hapus section"
                  className="p-1.5 md:p-1 rounded text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          );
        })}

        {/* Floating Notion Slash Command Menu */}
        {slashMenuState.isOpen && (
          <AdminArticleSlashMenu
            isOpen={slashMenuState.isOpen}
            onClose={() =>
              setSlashMenuState({ isOpen: false, blockId: null, query: "" })
            }
            onSelect={handleSlashSelect}
            query={slashMenuState.query}
            position={slashMenuState.position}
          />
        )}
      </div>

      {/* Empty space below blocks for clicking to focus/type */}
      <div className="h-24 w-full cursor-text" />
    </div>
  );
}
