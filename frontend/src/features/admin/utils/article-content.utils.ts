import type {
  AdminArticleStatus,
  ArticleBlockType,
  ArticleEditorBlock,
  BackendBlogStatus,
} from "../types/admin-article.types";

/**
 * Map backend blog status ('draft' | 'published' | 'archived') to frontend card status.
 */
export function mapBackendStatusToUi(status?: string | null): AdminArticleStatus {
  if (status === "published") return "published";
  if (status === "archived" || status === "unpublished") return "unpublished";
  return "draft";
}

/**
 * Map frontend article status to backend status enum ('draft' | 'published' | 'archived').
 */
export function mapUiStatusToBackend(status: AdminArticleStatus): BackendBlogStatus {
  if (status === "published") return "published";
  if (status === "unpublished") return "archived";
  return "draft";
}

/**
 * Format ISO date string into DD/MM/YYYY for card badge display.
 */
export function formatArticlePublishedDate(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Format ISO updated_at timestamp into a readable Indonesian relative/short string.
 */
export function formatArticleLastEdited(iso?: string | null): string {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatInlineMarkdownToHtml(escapedText: string): string {
  let result = escapedText;
  // Inline code: `code`
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Links: [label](https://...)
  result = result.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  // Bold: **text** or __text__
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  // Strikethrough: ~~text~~
  result = result.replace(/~~([^~]+)~~/g, "<s>$1</s>");
  // Italic: *text* or _text_
  result = result.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");
  result = result.replace(/(?<!\w)_([^_]+)_(?!\w)/g, "<em>$1</em>");
  return result;
}

function wrapInlineFormatting(block: ArticleEditorBlock, escapedText: string): string {
  let result = formatInlineMarkdownToHtml(escapedText).replace(/\n/g, "<br />");
  if (block.isStrike) result = `<s>${result}</s>`;
  if (block.isUnderline) result = `<u>${result}</u>`;
  if (block.isItalic) result = `<em>${result}</em>`;
  if (block.isBold) result = `<strong>${result}</strong>`;
  return result;
}

function buildAlignAttr(align?: "left" | "center" | "right"): string {
  if (!align || align === "left") return "";
  return ` style="text-align:${align}"`;
}

/**
 * Serialize Notion-style editor blocks into clean semantic HTML string
 * suitable for storing in PostgreSQL `blogs.content` and rendering cleanly.
 */
export function serializeArticleBlocksToHtml(blocks: ArticleEditorBlock[]): string {
  if (!blocks || blocks.length === 0) return "";

  const parts: string[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bullet-list" || block.type === "numbered-list") {
      const listType = block.type;
      const tag = listType === "bullet-list" ? "ul" : "ol";
      const items: string[] = [];

      while (i < blocks.length && blocks[i].type === listType) {
        const itemText = blocks[i].content.trim();
        if (itemText) {
          items.push(`<li>${wrapInlineFormatting(blocks[i], escapeHtml(itemText))}</li>`);
        }
        i += 1;
      }

      if (items.length > 0) {
        parts.push(`<${tag}>${items.join("")}</${tag}>`);
      }
      continue;
    }

    switch (block.type) {
      case "h1":
      case "h2":
      case "h3":
      case "h4": {
        const txt = block.content.trim();
        if (txt) {
          parts.push(`<${block.type}${buildAlignAttr(block.align)}>${escapeHtml(txt)}</${block.type}>`);
        }
        break;
      }
      case "paragraph": {
        const txt = block.content.trim();
        if (txt) {
          parts.push(
            `<p${buildAlignAttr(block.align)}>${wrapInlineFormatting(block, escapeHtml(block.content))}</p>`
          );
        }
        break;
      }
      case "quote": {
        const txt = block.content.trim();
        if (txt) {
          parts.push(`<blockquote>${escapeHtml(block.content)}</blockquote>`);
        }
        break;
      }
      case "code": {
        const txt = block.content.trim();
        if (txt) {
          parts.push(`<pre><code>${escapeHtml(block.content)}</code></pre>`);
        }
        break;
      }
      case "callout": {
        const txt = block.content.trim();
        if (txt) {
          parts.push(`<div data-callout="true">${escapeHtml(block.content)}</div>`);
        }
        break;
      }
      case "divider": {
        parts.push("<hr />");
        break;
      }
      case "image": {
        if (block.imageUrl) {
          const caption = block.imageCaption
            ? `<figcaption>${escapeHtml(block.imageCaption)}</figcaption>`
            : "";
          parts.push(
            `<figure><img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(
              block.imageCaption || "Article image"
            )}" />${caption}</figure>`
          );
        }
        break;
      }
      case "table": {
        const rows = block.tableData || [];
        if (rows.length > 0) {
          const bodyHtml = rows
            .map(
              (row) =>
                `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
            )
            .join("");
          parts.push(`<table><tbody>${bodyHtml}</tbody></table>`);
        }
        break;
      }
    }

    i += 1;
  }

  return parts.join("\n");
}

function makeBlockId(index: number): string {
  return `blk-parsed-${index}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Parse Markdown text (headings, lists, quotes, code fences, dividers, paragraphs)
 * into ArticleEditorBlock[] for both editing and rich rendering.
 */
export function parseMarkdownToArticleBlocks(rawMarkdown: string): ArticleEditorBlock[] {
  const normalized = rawMarkdown.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [{ id: "blk-initial", type: "paragraph", content: "" }];
  }

  const rawLines = normalized.split("\n");
  const blocks: ArticleEditorBlock[] = [];
  let idx = 0;
  let i = 0;

  while (i < rawLines.length) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    // Fenced code block: ```
    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      i += 1;
      while (i < rawLines.length && !rawLines[i].trim().startsWith("```")) {
        codeLines.push(rawLines[i]);
        i += 1;
      }
      if (i < rawLines.length) i += 1; // skip closing ```
      blocks.push({
        id: makeBlockId(idx++),
        type: "code",
        content: codeLines.join("\n"),
      });
      continue;
    }

    // Horizontal divider: --- or *** or ___
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({
        id: makeBlockId(idx++),
        type: "divider",
        content: "",
      });
      i += 1;
      continue;
    }

    // Headings: # .. ####
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4;
      blocks.push({
        id: makeBlockId(idx++),
        type: `h${level}` as ArticleBlockType,
        content: headingMatch[2].trim(),
      });
      i += 1;
      continue;
    }

    // Blockquote: > ...
    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      blocks.push({
        id: makeBlockId(idx++),
        type: "quote",
        content: quoteMatch[1].trim(),
      });
      i += 1;
      continue;
    }

    // Bullet list: - item or * item
    const bulletMatch = trimmed.match(/^[-*+]\s+(.+)$/);
    if (bulletMatch) {
      blocks.push({
        id: makeBlockId(idx++),
        type: "bullet-list",
        content: bulletMatch[1].trim(),
      });
      i += 1;
      continue;
    }

    // Numbered list: 1. item
    const numberedMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (numberedMatch) {
      blocks.push({
        id: makeBlockId(idx++),
        type: "numbered-list",
        content: numberedMatch[1].trim(),
      });
      i += 1;
      continue;
    }

    // Regular paragraph
    blocks.push({
      id: makeBlockId(idx++),
      type: "paragraph",
      content: trimmed,
    });
    i += 1;
  }

  return blocks.length > 0
    ? blocks
    : [{ id: "blk-initial", type: "paragraph", content: "" }];
}

function htmlNodeToInlineMarkdown(node: Element): string {
  const serializeChildren = (parent: Node): string => {
    let out = "";
    parent.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        out += child.textContent || "";
        return;
      }
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as Element;
        const tag = el.tagName.toLowerCase();
        const inner = serializeChildren(el);
        if (tag === "br") {
          out += "\n";
        } else if (tag === "strong" || tag === "b") {
          out += inner ? `**${inner}**` : "";
        } else if (tag === "em" || tag === "i") {
          out += inner ? `*${inner}*` : "";
        } else if (tag === "s" || tag === "del" || tag === "strike") {
          out += inner ? `~~${inner}~~` : "";
        } else if (tag === "code") {
          out += inner ? `\`${inner}\`` : "";
        } else if (tag === "a") {
          const href = el.getAttribute("href") || "";
          out += href ? `[${inner || href}](${href})` : inner;
        } else {
          out += inner;
        }
      }
    });
    return out;
  };
  return serializeChildren(node).trim();
}

function extractInlineStyleFlags(el: Element): {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrike: boolean;
  align?: "left" | "center" | "right";
} {
  const htmlEl = el as HTMLElement;
  const textAlign = htmlEl.style?.textAlign;
  const align =
    textAlign === "center" || textAlign === "right" || textAlign === "left"
      ? textAlign
      : undefined;

  return {
    isBold: Boolean(el.querySelector("strong, b")),
    isItalic: Boolean(el.querySelector("em, i")),
    isUnderline: Boolean(el.querySelector("u")),
    isStrike: Boolean(el.querySelector("s, del, strike")),
    align,
  };
}

/**
 * Parse stored blog content (JSON blocks, HTML, or plain text paragraphs)
 * into ArticleEditorBlock[] for seamless editing in AdminArticleBlockEditor.
 */
export function parseContentToArticleBlocks(rawContent?: string | null): ArticleEditorBlock[] {
  const content = (rawContent || "").trim();
  if (!content) {
    return [{ id: "blk-initial", type: "paragraph", content: "" }];
  }

  // 1. JSON array fallback (if stored by older prototypes)
  if (content.startsWith("[")) {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.type) {
        return parsed as ArticleEditorBlock[];
      }
    } catch {
      // Not valid JSON, continue parsing as HTML / plain text
    }
  }

  // 2. HTML parsing when running in browser DOM
  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(content);
  if (looksLikeHtml && typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const blocks: ArticleEditorBlock[] = [];
      let idx = 0;

      const pushNode = (node: Element) => {
        const tag = node.tagName.toLowerCase();

        if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") {
          const { align } = extractInlineStyleFlags(node);
          blocks.push({
            id: makeBlockId(idx++),
            type: tag as ArticleBlockType,
            content: (node.textContent || "").trim(),
            align,
          });
          return;
        }

        if (tag === "p") {
          const markdownText = htmlNodeToInlineMarkdown(node);
          if (markdownText) {
            const { align } = extractInlineStyleFlags(node);
            blocks.push({
              id: makeBlockId(idx++),
              type: "paragraph",
              content: markdownText,
              align,
            });
          }
          return;
        }

        if (tag === "ul" || tag === "ol") {
          const listType: ArticleBlockType = tag === "ul" ? "bullet-list" : "numbered-list";
          node.querySelectorAll(":scope > li").forEach((li) => {
            const markdownText = htmlNodeToInlineMarkdown(li);
            if (markdownText) {
              blocks.push({
                id: makeBlockId(idx++),
                type: listType,
                content: markdownText,
              });
            }
          });
          return;
        }

        if (tag === "blockquote") {
          blocks.push({
            id: makeBlockId(idx++),
            type: "quote",
            content: (node.textContent || "").trim(),
          });
          return;
        }

        if (tag === "pre") {
          blocks.push({
            id: makeBlockId(idx++),
            type: "code",
            content: (node.textContent || "").trim(),
          });
          return;
        }

        if (tag === "hr") {
          blocks.push({
            id: makeBlockId(idx++),
            type: "divider",
            content: "",
          });
          return;
        }

        if (tag === "div" && node.getAttribute("data-callout") === "true") {
          blocks.push({
            id: makeBlockId(idx++),
            type: "callout",
            content: (node.textContent || "").trim(),
          });
          return;
        }

        if (tag === "figure" || tag === "img") {
          const imgEl = tag === "img" ? node : node.querySelector("img");
          const captionEl = node.querySelector("figcaption");
          const src = imgEl?.getAttribute("src") || "";
          if (src) {
            blocks.push({
              id: makeBlockId(idx++),
              type: "image",
              content: "",
              imageUrl: src,
              imageCaption: (captionEl?.textContent || imgEl?.getAttribute("alt") || "").trim(),
            });
          }
          return;
        }

        if (tag === "table") {
          const rows: string[][] = [];
          node.querySelectorAll("tr").forEach((tr) => {
            const cells: string[] = [];
            tr.querySelectorAll("th, td").forEach((cell) => {
              cells.push((cell.textContent || "").trim());
            });
            if (cells.length > 0) rows.push(cells);
          });
          if (rows.length > 0) {
            blocks.push({
              id: makeBlockId(idx++),
              type: "table",
              content: "",
              tableData: rows,
            });
          }
          return;
        }

        const fallbackText = (node.textContent || "").trim();
        if (fallbackText) {
          blocks.push({
            id: makeBlockId(idx++),
            type: "paragraph",
            content: fallbackText,
          });
        }
      };

      Array.from(doc.body.children).forEach(pushNode);

      if (blocks.length > 0) {
        return blocks;
      }
    } catch {
      // Fallback to plain text parsing below
    }
  }

  // 3. Markdown / plain text fallback
  const stripped = content.replace(/<[^>]+>/g, "");
  return parseMarkdownToArticleBlocks(stripped);
}

/**
 * Extract plain-text excerpt from blocks for short_description fallback.
 */
export function extractExcerptFromBlocks(blocks: ArticleEditorBlock[], maxLength = 180): string {
  const joined = blocks
    .filter((b) => b.content && b.content.trim().length > 0)
    .map((b) => b.content.trim())
    .join(" ");

  if (joined.length <= maxLength) return joined;
  return `${joined.slice(0, maxLength - 3).trim()}...`;
}

