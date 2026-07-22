const SPRITES_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export const getIdFromUrl = (url) => {
  if (!url) return null
  const segments = url.split('/').filter(Boolean)
  return Number(segments[segments.length - 1])
}

export const getSpriteUrl = (id) => (id ? `${SPRITES_BASE_URL}/${id}.png` : null)

export const getArtworkUrl = (id) =>
  id ? `${SPRITES_BASE_URL}/other/official-artwork/${id}.png` : null
