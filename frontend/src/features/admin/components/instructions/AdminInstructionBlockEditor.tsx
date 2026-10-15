import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AdminInstructionSlashMenu } from "./AdminInstructionSlashMenu";
import { AdminInstructionTableBlock } from "./AdminInstructionTableBlock";
import type {
  InstructionBlockType,
  InstructionEditorBlock,
} from "../../types/admin-instruction.types";

export interface AdminInstructionBlockEditorProps {
  blocks: InstructionEditorBlock[];
  onBlocksChange: (blocks: InstructionEditorBlock[]) => void;
  activeBlockId: string | null;
  onActiveBlockChange: (id: string | null) => void;
  zoom?: number;
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

export function AdminInstructionBlockEditor({
  blocks,
  onBlocksChange,
  activeBlockId,
  onActiveBlockChange,
  zoom = 100,
  className,
}: AdminInstructionBlockEditorProps) {
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

  const blockRefs = React.useRef<
    Map<string, HTMLTextAreaElement | HTMLInputElement>
  >(new Map());

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

    onBlocksChange(
      blocks.map((b) => (b.id === id ? { ...b, content: value } : b))
    );
  };

  // Key Down Handler: Seamless Enter to create new section + Backspace to remove
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number,
    block: InstructionEditorBlock
  ) => {
    if (slashMenuState.isOpen) {
      if (["ArrowUp", "ArrowDown", "Enter", "Escape"].includes(e.key)) {
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // If empty list/step item, pressing Enter turns it into a normal paragraph
      if (
        (block.type === "bullet-list" ||
          block.type === "numbered-list" ||
          block.type === "step") &&
        block.content.trim() === ""
      ) {
        onBlocksChange(
          blocks.map((b) =>
            b.id === block.id ? { ...b, type: "paragraph" } : b
          )
        );
        return;
      }

      // Calculate split text position at cursor
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const cursorPos = target.selectionStart ?? block.content.length;
      const contentBefore = block.content.slice(0, cursorPos);
      const contentAfter = block.content.slice(cursorPos);

      // In Notion, list/step keeps its type; headings create normal paragraph below
      const nextType: InstructionBlockType =
        block.type === "bullet-list"
          ? "bullet-list"
          : block.type === "numbered-list"
          ? "numbered-list"
          : block.type === "step"
          ? "step"
          : "paragraph";

      const newBlock: InstructionEditorBlock = {
        id: `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: nextType,
        content: contentAfter,
        align: block.align,
        isBold: block.isBold,
        isItalic: block.isItalic,
      };

      const updatedBlocks = [
        ...blocks.slice(0, index),
        { ...block, content: contentBefore },
        newBlock,
        ...blocks.slice(index + 1),
      ];

      onBlocksChange(updatedBlocks);
      focusBlock(newBlock.id, true);
      return;
    }

    // Backspace on empty block removes it and focuses previous block
    if (e.key === "Backspace") {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      const cursorPos = target.selectionStart ?? 0;

      if (cursorPos === 0 && block.content === "" && blocks.length > 1) {
        e.preventDefault();
        const prevBlock = blocks[index - 1];
        const updated = blocks.filter((b) => b.id !== block.id);
        onBlocksChange(updated);
        if (prevBlock) {
          focusBlock(prevBlock.id);
        }
        return;
      }

      // If it's a special block type with no content, backspace reverts to paragraph first
      if (
        cursorPos === 0 &&
        block.content === "" &&
        block.type !== "paragraph"
      ) {
        e.preventDefault();
        onBlocksChange(
          blocks.map((b) =>
            b.id === block.id ? { ...b, type: "paragraph" } : b
          )
        );
        return;
      }
    }
  };

  // Selecting block from Notion Slash Command Menu
  const handleSlashSelect = (selectedType: InstructionBlockType) => {
    if (!slashMenuState.blockId) return;

    const currentBlock = blocks.find((b) => b.id === slashMenuState.blockId);
    if (!currentBlock) return;

    // Clean out the '/' query text from the block content
    const cleanedContent = currentBlock.content
      .replace(/(?:^|\s)\/[a-zA-Z0-9]*$/, "")
      .trim();

    const updated = blocks.map((b) => {
      if (b.id === slashMenuState.blockId) {
        return {
          ...b,
          type: selectedType,
          content: cleanedContent,
          tableData:
            selectedType === "table"
              ? [
                  ["", "", ""],
                  ["", "", ""],
                  ["", "", ""],
                ]
              : undefined,
        };
      }
      return b;
    });

    onBlocksChange(updated);
    setSlashMenuState({ isOpen: false, blockId: null, query: "" });
    focusBlock(slashMenuState.blockId);
  };

  // Add block directly below
  const handleAddBlockBelow = (index: number) => {
    const newBlock: InstructionEditorBlock = {
      id: `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "paragraph",
      content: "",
    };
    const updated = [
      ...blocks.slice(0, index + 1),
      newBlock,
      ...blocks.slice(index + 1),
    ];
    onBlocksChange(updated);
    focusBlock(newBlock.id);
  };

  // Delete block
  const handleDeleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      onBlocksChange([{ id: `blk-${Date.now()}`, type: "paragraph", content: "" }]);
      return;
    }
    const idx = blocks.findIndex((b) => b.id === id);
    const updated = blocks.filter((b) => b.id !== id);
    onBlocksChange(updated);
    const prevBlock = updated[Math.max(0, idx - 1)];
    if (prevBlock) {
      focusBlock(prevBlock.id);
    }
  };

  // Drag and Drop Swap Handler
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", `${index}`);
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const sourceIdx = draggedIndex;
    if (sourceIdx === null || sourceIdx === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(sourceIdx, 1);
    newBlocks.splice(dropIndex, 0, movedBlock);

    onBlocksChange(newBlocks);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Upload image handler
  const handleImageUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onBlocksChange(
        blocks.map((b) => (b.id === id ? { ...b, imageUrl: result } : b))
      );
    };
    reader.readAsDataURL(file);
  };

  // Calculate dynamic step numbering for step blocks
  let currentStepCounter = 0;

  return (
    <div
      style={{
        transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
        transformOrigin: "top left",
      }}
      className={cn("w-full transition-transform duration-150 font-sans", className)}
    >
      {/* Interactive Blocks List: starts directly with "Mulai buat instruksi." matching Gambar 3 */}
      <div className="space-y-3 relative font-sans pl-11 pr-2">
        {blocks.map((block, index) => {
          const isDragOver = dragOverIndex === index;

          if (block.type === "step") {
            currentStepCounter += 1;
          }

          return (
            <div
              key={block.id}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={cn(
                "group relative w-full flex items-start transition-all rounded-lg font-sans",
                isDragOver && "border-t-2 border-indigo-500 pt-1"
              )}
            >
              {/* Left Gutter Action Controls: Grip (drag) + Plus (add) + Trash (delete) */}
              <div className="absolute right-full mr-3.5 top-0.5 opacity-0 group-hover:opacity-100 flex items-center gap-1 select-none transition-opacity z-20">
                {/* 1. Drag & Drop Reorder Grip Handle */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  title="Drag untuk menukar urutan baris"
                  className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-grab active:cursor-grabbing transition-colors"
                >
                  <GripVerticalIcon />
                </div>

                {/* 2. Add Section Below (+) */}
                <button
                  type="button"
                  onClick={() => handleAddBlockBelow(index)}
                  title="Tambah baris baru di bawah"
                  className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <PlusIcon />
                </button>

                {/* 3. Delete Section */}
                <button
                  type="button"
                  onClick={() => handleDeleteBlock(block.id)}
                  title="Hapus baris"
                  className="p-1 rounded text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                >
                  <TrashIcon />
                </button>
              </div>

              {/* Block Content by Type */}
              <div className="w-full min-w-0 font-sans">
                {/* Paragraph: Matching Image 3 placeholder "Mulai buat instruksi." */}
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
                    placeholder={
                      index === 0 && blocks.length === 1
                        ? "Mulai buat instruksi."
                        : "Ketik '/' untuk opsi..."
                    }
                    rows={1}
                    className={cn(
                      "w-full p-0 m-0 bg-transparent resize-none border-none outline-none font-sans text-sm sm:text-base text-gray-200 placeholder-gray-500 leading-relaxed overflow-hidden block",
                      block.align === "center" && "text-center",
                      block.align === "right" && "text-right",
                      block.isBold && "font-bold",
                      block.isItalic && "italic",
                      block.isUnderline && "underline",
                      block.isStrike && "line-through"
                    )}
                  />
                )}

                {/* Step Block (Instruction Steps) */}
                {block.type === "step" && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-deep-blue-900/40 border border-deep-blue-700 w-full my-1">
                    <span className="w-6 h-6 rounded-md bg-deep-blue-800 border border-deep-blue-600 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {currentStepCounter}
                    </span>
                    <div className="flex-1 min-w-0 space-y-1.5">
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
                        placeholder={`Tulis panduan Langkah ${currentStepCounter}...`}
                        rows={1}
                        className={cn(
                          "w-full p-0 m-0 bg-transparent resize-none border-none outline-none font-sans text-sm font-medium text-white placeholder-gray-500 leading-relaxed overflow-hidden block",
                          block.isBold && "font-bold",
                          block.isItalic && "italic",
                          block.isUnderline && "underline",
                          block.isStrike && "line-through"
                        )}
                      />
                    </div>
                  </div>
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
                      "w-full p-0 m-0 bg-transparent border-none outline-none font-sans text-2xl sm:text-3xl font-bold text-white placeholder-gray-500 tracking-tight block",
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
                      "w-full p-0 m-0 bg-transparent border-none outline-none font-sans text-xl sm:text-2xl font-semibold text-white placeholder-gray-500 tracking-tight block",
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
                      "w-full p-0 m-0 bg-transparent border-none outline-none font-sans text-lg sm:text-xl font-semibold text-white placeholder-gray-500 block",
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
                      "w-full p-0 m-0 bg-transparent border-none outline-none font-sans text-base font-semibold text-white placeholder-gray-500 block",
                      block.align === "center" && "text-center",
                      block.align === "right" && "text-right"
                    )}
                  />
                )}

                {/* Bullet List */}
                {block.type === "bullet-list" && (
                  <div className="flex items-start gap-2.5 w-full font-sans">
                    <span className="text-gray-400 select-none text-base leading-6 mt-0.5">
                      •
                    </span>
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
                      placeholder="List item..."
                      rows={1}
                      className={cn(
                        "w-full p-0 m-0 bg-transparent resize-none border-none outline-none font-sans text-sm sm:text-base text-gray-200 placeholder-gray-500 leading-relaxed overflow-hidden block",
                        block.isBold && "font-bold",
                        block.isItalic && "italic",
                        block.isUnderline && "underline",
                        block.isStrike && "line-through"
                      )}
                    />
                  </div>
                )}

                {/* Numbered List */}
                {block.type === "numbered-list" && (
                  <div className="flex items-start gap-2.5 w-full font-sans">
                    <span className="text-xs font-semibold text-gray-400 select-none leading-6 min-w-4.5">
                      {index + 1}.
                    </span>
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
                      placeholder="Numbered item..."
                      rows={1}
                      className={cn(
                        "w-full p-0 m-0 bg-transparent resize-none border-none outline-none font-sans text-sm sm:text-base text-gray-200 placeholder-gray-500 leading-relaxed overflow-hidden block",
                        block.isBold && "font-bold",
                        block.isItalic && "italic",
                        block.isUnderline && "underline",
                        block.isStrike && "line-through"
                      )}
                    />
                  </div>
                )}

                {/* Image Block */}
                {block.type === "image" && (
                  <div className="w-full space-y-2 my-2">
                    {block.imageUrl ? (
                      <div className="relative group/img rounded-lg overflow-hidden border border-deep-blue-700 bg-deep-blue-900">
                        <Image
                          src={block.imageUrl}
                          alt={block.imageCaption || "Instruction image"}
                          width={1000}
                          height={500}
                          className="w-full h-auto max-h-96 object-cover rounded-lg"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover/img:opacity-100 transition-opacity">
                          <label className="px-3 py-1.5 rounded-lg bg-deep-blue-950/90 hover:bg-deep-blue-950 border border-deep-blue-700 text-xs font-medium text-white cursor-pointer backdrop-blur-md">
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
                      <div className="p-8 border-2 border-dashed border-deep-blue-700 rounded-lg bg-deep-blue-900/40 flex flex-col items-center justify-center gap-3">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <div className="text-center space-y-1">
                          <p className="text-xs font-medium text-gray-300">
                            Unggah Gambar Instruksi
                          </p>
                          <p className="text-[11px] text-gray-500">
                            PNG, JPG, WebP hingga 10MB
                          </p>
                        </div>
                        <label className="px-4 py-2 rounded-lg bg-deep-blue-900 hover:bg-deep-blue-800 border border-deep-blue-700 text-xs font-medium text-white cursor-pointer transition-colors">
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
                      className="w-full text-center font-sans text-xs text-gray-400 placeholder-gray-600 bg-transparent border-none outline-none"
                    />
                  </div>
                )}

                {/* Quote */}
                {block.type === "quote" && (
                  <div className="border-l-4 border-indigo-500 pl-4 my-2 w-full font-sans">
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
                      placeholder="Tulis kutipan atau highlight instruksi..."
                      rows={1}
                      className="w-full p-0 m-0 bg-transparent resize-none border-none outline-none italic font-sans text-sm sm:text-base text-gray-300 placeholder-gray-500 leading-relaxed overflow-hidden block"
                    />
                  </div>
                )}

                {/* Code Block */}
                {block.type === "code" && (
                  <div className="p-3.5 rounded-lg bg-deep-blue-950 border border-deep-blue-700 font-mono my-2 w-full">
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
                      placeholder="// Tulis perintah terminal atau kode aktivasi..."
                      rows={2}
                      className="w-full p-0 m-0 bg-transparent resize-none border-none outline-none text-xs sm:text-sm text-indigo-300 placeholder-gray-600 leading-relaxed font-mono block"
                    />
                  </div>
                )}

                {/* Callout */}
                {block.type === "callout" && (
                  <div className="p-3.5 rounded-lg bg-deep-blue-900/60 border border-indigo-500/40 flex items-start gap-3 my-2 w-full font-sans">
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
                      placeholder="Tips penting atau catatan aktivasi..."
                      rows={1}
                      className="w-full p-0 m-0 bg-transparent resize-none border-none outline-none font-sans text-xs sm:text-sm text-gray-200 placeholder-gray-500 leading-relaxed overflow-hidden block"
                    />
                  </div>
                )}

                {/* Divider */}
                {block.type === "divider" && (
                  <div className="py-2 w-full">
                    <hr className="border-t border-deep-blue-700" />
                  </div>
                )}

                {/* Table Block (Matching Image 3 table icon) */}
                {block.type === "table" && (
                  <AdminInstructionTableBlock
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
            </div>
          );
        })}

        {/* Floating Notion Slash Command Menu */}
        {slashMenuState.isOpen && (
          <AdminInstructionSlashMenu
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
      <div
        className="h-28 w-full cursor-text"
        onClick={() => {
          const lastBlock = blocks[blocks.length - 1];
          if (lastBlock) {
            focusBlock(lastBlock.id);
          }
        }}
      />
    </div>
  );
}
