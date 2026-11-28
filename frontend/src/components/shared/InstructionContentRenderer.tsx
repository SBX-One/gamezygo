import * as React from "react";
import { cn } from "@/lib/utils";
import { parseContentToArticleBlocks } from "@/features/admin/utils/article-content.utils";
import type { ArticleEditorBlock } from "@/features/admin/types/admin-article.types";
import type { InstructionStep } from "@/features/admin/types/admin-instruction.types";

export interface InstructionContentRendererProps {
  content?: string | null;
  steps?: InstructionStep[];
  className?: string;
}

/**
 * Safely renders inline Markdown (**bold**, *italic*, ~~strike~~, `code`, [label](url))
 * into pure React elements without dangerouslySetInnerHTML.
 */
function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  const tokenRegex =
    /(`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|\*[^*]+\*|_[^_]+_)/g;

  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-deep-blue-950 border border-white/10 font-mono text-[0.9em] text-indigo-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 underline underline-offset-2 hover:text-indigo-300 transition-colors"
        >
          {linkMatch[1]}
        </a>
      );
    }

    if (
      (part.startsWith("**") && part.endsWith("**") && part.length > 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length > 4)
    ) {
      return (
        <strong key={idx} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("~~") && part.endsWith("~~") && part.length > 4) {
      return (
        <s key={idx} className="line-through text-gray-500">
          {part.slice(2, -2)}
        </s>
      );
    }

    if (
      (part.startsWith("*") && part.endsWith("*") && part.length > 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length > 2)
    ) {
      return (
        <em key={idx} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function getAlignClass(align?: "left" | "center" | "right"): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "";
}

function renderBlockNodes(blocks: ArticleEditorBlock[]): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // Group consecutive bullet-list or numbered-list blocks into a single <ul> / <ol>
    if (block.type === "bullet-list" || block.type === "numbered-list") {
      const listType = block.type;
      const items: ArticleEditorBlock[] = [];
      while (i < blocks.length && blocks[i].type === listType) {
        if (blocks[i].content.trim()) {
          items.push(blocks[i]);
        }
        i += 1;
      }

      if (items.length > 0) {
        const ListTag = listType === "bullet-list" ? "ul" : "ol";
        nodes.push(
          <ListTag
            key={`list-${items[0].id}`}
            className={cn(
              "pl-5 space-y-1.5 text-body-sm text-gray-300 leading-relaxed",
              listType === "bullet-list" ? "list-disc" : "list-decimal"
            )}
          >
            {items.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "wrap-break-word",
                  item.isBold && "font-semibold text-white",
                  item.isItalic && "italic",
                  item.isUnderline && "underline",
                  item.isStrike && "line-through"
                )}
              >
                {renderInlineMarkdown(item.content)}
              </li>
            ))}
          </ListTag>
        );
      }
      continue;
    }

    const alignCls = getAlignClass(block.align);

    switch (block.type) {
      case "h1":
        if (block.content.trim()) {
          nodes.push(
            <h3
              key={block.id}
              className={cn("text-lg sm:text-xl font-bold text-white tracking-tight pt-1", alignCls)}
            >
              {renderInlineMarkdown(block.content)}
            </h3>
          );
        }
        break;
      case "h2":
        if (block.content.trim()) {
          nodes.push(
            <h4
              key={block.id}
              className={cn("text-base sm:text-lg font-semibold text-white tracking-tight pt-1", alignCls)}
            >
              {renderInlineMarkdown(block.content)}
            </h4>
          );
        }
        break;
      case "h3":
      case "h4":
        if (block.content.trim()) {
          nodes.push(
            <h5
              key={block.id}
              className={cn("text-sm sm:text-base font-semibold text-gray-100 pt-0.5", alignCls)}
            >
              {renderInlineMarkdown(block.content)}
            </h5>
          );
        }
        break;
      case "quote":
        if (block.content.trim()) {
          nodes.push(
            <blockquote
              key={block.id}
              className="border-l-2 border-indigo-400/70 pl-4 py-1 italic text-body-sm text-gray-300 bg-white/[0.02] rounded-r-md"
            >
              {renderInlineMarkdown(block.content)}
            </blockquote>
          );
        }
        break;
      case "code":
        if (block.content.trim()) {
          nodes.push(
            <pre
              key={block.id}
              className="p-3.5 rounded-lg bg-deep-blue-950 border border-white/10 overflow-x-auto text-xs font-mono text-gray-200 leading-relaxed"
            >
              <code>{block.content}</code>
            </pre>
          );
        }
        break;
      case "callout":
        if (block.content.trim()) {
          nodes.push(
            <div
              key={block.id}
              className="p-3.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-body-sm text-gray-200 leading-relaxed"
            >
              {renderInlineMarkdown(block.content)}
            </div>
          );
        }
        break;
      case "divider":
        nodes.push(
          <hr key={block.id} className="border-t border-white/10 my-1" />
        );
        break;
      case "image":
        if (block.imageUrl) {
          nodes.push(
            <figure key={block.id} className="flex flex-col gap-1.5 my-1">
              <img
                src={block.imageUrl}
                alt={block.imageCaption || "Instruction image"}
                className="max-w-full rounded-lg border border-white/10 object-contain"
                loading="lazy"
              />
              {block.imageCaption && (
                <figcaption className="text-body-xs text-gray-400">
                  {block.imageCaption}
                </figcaption>
              )}
            </figure>
          );
        }
        break;
      case "table":
        if (block.tableData && block.tableData.length > 0) {
          nodes.push(
            <div key={block.id} className="overflow-x-auto my-1">
              <table className="w-full border-collapse text-body-xs text-gray-300">
                <tbody>
                  {block.tableData.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-white/10">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={cn(
                            "px-3 py-2 border border-white/10",
                            rIdx === 0 && "font-semibold text-white bg-white/5"
                          )}
                        >
                          {renderInlineMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        break;
      case "paragraph":
      default:
        if (block.content.trim()) {
          nodes.push(
            <p
              key={block.id}
              className={cn(
                "text-body-sm text-gray-300 leading-relaxed whitespace-pre-line wrap-break-word",
                alignCls,
                block.isBold && "font-semibold text-white",
                block.isItalic && "italic",
                block.isUnderline && "underline",
                block.isStrike && "line-through"
              )}
            >
              {renderInlineMarkdown(block.content)}
            </p>
          );
        }
        break;
    }

    i += 1;
  }

  return nodes;
}

export function InstructionContentRenderer({
  content,
  steps,
  className,
}: InstructionContentRendererProps) {
  const blocks = React.useMemo(() => {
    if (!content || !content.trim()) return [];
    return parseContentToArticleBlocks(content).filter(
      (b) =>
        b.type === "divider" ||
        (b.type === "image" && Boolean(b.imageUrl)) ||
        (b.type === "table" && Boolean(b.tableData?.length)) ||
        Boolean(b.content?.trim())
    );
  }, [content]);

  if (blocks.length > 0) {
    return (
      <div className={cn("flex flex-col gap-3 min-w-0", className)}>
        {renderBlockNodes(blocks)}
      </div>
    );
  }

  if (steps && steps.length > 0) {
    return (
      <div className={cn("flex flex-col gap-3 min-w-0", className)}>
        {steps.map((step) => (
          <div key={step.stepNumber} className="flex flex-col gap-1">
            {step.title && (
              <h4 className="text-body-md font-semibold text-gray-100">
                {renderInlineMarkdown(step.title)}
              </h4>
            )}
            {step.description && (
              <p className="text-body-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {renderInlineMarkdown(step.description)}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
