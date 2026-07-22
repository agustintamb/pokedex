export function getIdFromUrl(url) {
  if (!url) return null
  const segments = url.split('/').filter(Boolean)
  return Number(segments[segments.length - 1])
}
