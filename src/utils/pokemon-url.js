const SPRITES_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export const getIdFromUrl = (url) => {
  if (!url) return null
  const segments = url.split('/').filter(Boolean)
  return Number(segments[segments.length - 1])
}

export const getSpriteUrl = (id) => (id ? `${SPRITES_BASE_URL}/${id}.png` : null)

// Solo cubre hasta Gen 5 (id <= 649) — para el resto no existe y hay que
// hacer fallback a getSpriteUrl (ver TeamCard, único lugar donde se usa)
export const getAnimatedSpriteUrl = (id) =>
  id ? `${SPRITES_BASE_URL}/versions/generation-v/black-white/animated/${id}.gif` : null
