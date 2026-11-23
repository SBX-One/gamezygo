/**
 * Resolves an image URL to a clean URL for Next.js Image component.
 * Converts local storage URLs (e.g. 'http://localhost:8000/storage/...') to relative '/storage/...'
 * paths so that Next.js rewrites handle it directly, preventing Next.js SSRF private IP blocks
 * ["::1", "127.0.0.1"] and ensuring images work properly when accessed via tunnels (ngrok).
 */
export function resolveImageUrl(
  url?: string | null,
  fallback = "https://placehold.co/300x400?text=No+Image"
): string {
  if (!url || !url.trim() || url === "/storage/" || url === "/storage") {
    return fallback;
  }

  const trimmed = url.trim();

  // If accidentally formatted as http://localhost:8000/storage/ but path is empty
  if (
    trimmed === "http://localhost:8000/storage/" ||
    trimmed === "http://localhost:8000/storage" ||
    trimmed === "http://127.0.0.1:8000/storage/" ||
    trimmed === "http://127.0.0.1:8000/storage"
  ) {
    return fallback;
  }

  // Convert localhost/127.0.0.1 storage URLs to relative '/storage/...'
  // Next.js rewrites in next.config.ts automatically proxy '/storage/:path*' to backend.
  // This avoids Next.js Image optimizer blocking private IP ["::1", "127.0.0.1"]
  // and allows images to load when accessed through ngrok or mobile devices.
  if (trimmed.startsWith("http://localhost:8000/storage/")) {
    return trimmed.replace("http://localhost:8000", "");
  }
  if (trimmed.startsWith("http://127.0.0.1:8000/storage/")) {
    return trimmed.replace("http://127.0.0.1:8000", "");
  }
  if (trimmed.startsWith("http://localhost/storage/")) {
    return trimmed.replace("http://localhost", "");
  }
  if (trimmed.startsWith("http://127.0.0.1/storage/")) {
    return trimmed.replace("http://127.0.0.1", "");
  }

  // If already relative /storage/...
  if (trimmed.startsWith("/storage/")) {
    return trimmed;
  }

  // If already full external absolute URL (S3, Steam, placeholder, etc.)
  if (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  // Other http absolute URLs (not localhost)
  if (trimmed.startsWith("http://")) {
    return trimmed;
  }

  // If relative path from storage without leading slash (e.g. 'storage/products/...')
  if (trimmed.startsWith("storage/")) {
    return `/${trimmed}`;
  }

  return `/${trimmed.replace(/^\/+/, "")}`;
}
