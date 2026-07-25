import { describe, it, expect, vi } from 'vitest'
import { pokeApi } from '@/api/pokeApi'
import { refreshListsOnReconnect } from './reconnect-refresh'

describe('refreshListsOnReconnect', () => {
  it('invalidates the list tag when the connection comes back', () => {
    const dispatch = vi.fn()
    const unsubscribe = refreshListsOnReconnect(dispatch)

    window.dispatchEvent(new Event('online'))

    expect(dispatch).toHaveBeenCalledWith(pokeApi.util.invalidateTags(['PokemonList']))
    unsubscribe()
  })

  it('does not invalidate anything until the event fires', () => {
    const dispatch = vi.fn()
    const unsubscribe = refreshListsOnReconnect(dispatch)

    expect(dispatch).not.toHaveBeenCalled()
    unsubscribe()
  })

  it('stops listening once unsubscribed', () => {
    const dispatch = vi.fn()
    const unsubscribe = refreshListsOnReconnect(dispatch)

    unsubscribe()
    window.dispatchEvent(new Event('online'))

    expect(dispatch).not.toHaveBeenCalled()
  })
})
