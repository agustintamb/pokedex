import { useState } from 'react'
import { getAnimatedSpriteUrl, getSpriteUrl } from '@/utils/pokemon-url'

// El gif animado solo existe hasta Gen 5, y no hay forma de saberlo sin pedirlo: se intenta
// y `onError` cae al estático. El id se sigue en estado para reintentar el gif cuando el
// mismo componente pasa a mostrar otro Pokémon.
export const useAnimatedSprite = (id) => {
  const [hasAnimatedError, setHasAnimatedError] = useState(false)
  const [lastId, setLastId] = useState(id)

  if (id !== lastId) {
    setLastId(id)
    setHasAnimatedError(false)
  }

  return {
    src: hasAnimatedError ? getSpriteUrl(id) : getAnimatedSpriteUrl(id),
    isStatic: hasAnimatedError,
    onError: () => setHasAnimatedError(true),
  }
}
