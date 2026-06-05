export function formatImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("https://") || url.startsWith("http://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  // Reject anything else (relative paths, javascript:, data:, etc.)
  return undefined;
}
