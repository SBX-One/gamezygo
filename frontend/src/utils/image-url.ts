/**
 * Resolves an image URL to a fully qualified URL.
 * Handles relative backend storage paths like '/storage/products/xyz.jpg' by prefixing
 * the backend origin or returning fallback placeholder.
 */
export function resolveImageUrl(
  url?: string | null,
  fallback = "https://placehold.co/300x400?text=No+Image"
): string {
  if (!url || !url.trim() || url === "/storage/" || url === "/storage") {
    return fallback;
  }

  const trimmed = url.trim();

  // If accidentally formatted as http://localhost/ without port 8000
  if (trimmed.startsWith("http://localhost/") && !trimmed.startsWith("http://localhost:8000/")) {
    const subPath = trimmed.replace("http://localhost/", "").trim();
    if (!subPath) return fallback;
    return `http://localhost:8000/${subPath}`;
  }

  // If accidentally formatted as http://127.0.0.1/ without port 8000
  if (trimmed.startsWith("http://127.0.0.1/") && !trimmed.startsWith("http://127.0.0.1:8000/")) {
    const subPath = trimmed.replace("http://127.0.0.1/", "").trim();
    if (!subPath) return fallback;
    return `http://localhost:8000/${subPath}`;
  }

  // If accidentally formatted as http://localhost:8000/storage/ but path is empty
  if (trimmed === "http://localhost:8000/storage/" || trimmed === "http://localhost:8000/storage") {
    return fallback;
  }

  // If already full absolute URL or blob or data URI
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  // If relative path from storage (e.g. '/storage/products/...')
  const backendOrigin =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
    "http://localhost:8000";

  return `${backendOrigin}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

