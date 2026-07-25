import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { createTestStore } from '@/test/render'
import { useGetPokemonDetailQuery } from '@/api/pokeApi'
import { useDetailPage } from './useDetailPage'

// El wrapper monta una Route con el segmento dinámico: MemoryRouter solo no alcanza para
// que useParams tenga el param.
vi.mock('@/api/pokeApi', () => ({
  useGetPokemonDetailQuery: vi.fn(),
}))

const buildWrapper =
  (store, route = '/pokemon/pikachu') =>
  ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/pokemon/:name" element={children} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

const detailFixture = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: ['electric'],
  abilities: [{ name: 'static', isHidden: false }],
  stats: [{ name: 'hp', value: 35 }],
  sprites: {
    front: 'front.png',
    frontShiny: 'front-shiny.png',
    frontFemale: null,
    frontShinyFemale: null,
    back: 'back.png',
    backShiny: 'back-shiny.png',
    backFemale: null,
    backShinyFemale: null,
    artwork: 'artwork.png',
    artworkShiny: 'artwork-shiny.png',
  },
}

describe('useDetailPage', () => {
  beforeEach(() => {
    useGetPokemonDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    })
  })

  it('exposes the loading state with no sprite data yet', () => {
    const store = createTestStore()
    const { result } = renderHook(() => useDetailPage(), { wrapper: buildWrapper(store) })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.detail).toBeUndefined()
    expect(result.current.spriteEntries).toEqual([])
    expect(result.current.artworkSrc).toBeNull()
  })

  it('calls refetch on retry', () => {
    const refetch = vi.fn()
    useGetPokemonDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
    })
    const store = createTestStore()
    const { result } = renderHook(() => useDetailPage(), { wrapper: buildWrapper(store) })

    act(() => result.current.handleRetry())

    expect(refetch).toHaveBeenCalled()
  })

  describe('once the detail has loaded', () => {
    beforeEach(() => {
      useGetPokemonDetailQuery.mockReturnValue({
        data: detailFixture,
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      })
    })

    it('builds the non-shiny sprite entries and defaults the selection to the first one', () => {
      const store = createTestStore()
      const { result } = renderHook(() => useDetailPage(), {
        wrapper: buildWrapper(store),
      })

      expect(result.current.spriteEntries.map((entry) => entry.key)).toEqual([
        'front',
        'back',
      ])
      expect(result.current.selectedSprite).toMatchObject({
        key: 'front',
        src: 'front.png',
      })
      expect(result.current.artworkSrc).toBe('artwork.png')
      expect(result.current.isShiny).toBe(false)
    })

    it('falls back to the front sprite as artwork when there is no official artwork', () => {
      useGetPokemonDetailQuery.mockReturnValue({
        data: {
          ...detailFixture,
          sprites: { ...detailFixture.sprites, artwork: undefined },
        },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      })
      const store = createTestStore()
      const { result } = renderHook(() => useDetailPage(), {
        wrapper: buildWrapper(store),
      })

      expect(result.current.artworkSrc).toBe('front.png')
    })

    it('honors the ?sprite= param when selecting the active sprite', () => {
      const store = createTestStore()
      const { result } = renderHook(() => useDetailPage(), {
        wrapper: buildWrapper(store, '/pokemon/pikachu?sprite=back'),
      })

      expect(result.current.selectedSprite).toMatchObject({
        key: 'back',
        src: 'back.png',
      })
    })

    it('switches to shiny sprites and artwork via handleToggleShiny', () => {
      const store = createTestStore()
      const { result } = renderHook(() => useDetailPage(), {
        wrapper: buildWrapper(store),
      })

      act(() => result.current.handleToggleShiny())

      expect(result.current.isShiny).toBe(true)
      expect(result.current.artworkSrc).toBe('artwork-shiny.png')
      expect(result.current.selectedSprite).toMatchObject({ src: 'front-shiny.png' })

      act(() => result.current.handleToggleShiny())
      expect(result.current.isShiny).toBe(false)
    })

    it('changes the selected sprite via handleSelectSprite', () => {
      const store = createTestStore()
      const { result } = renderHook(() => useDetailPage(), {
        wrapper: buildWrapper(store),
      })

      act(() => result.current.handleSelectSprite('back'))

      expect(result.current.selectedSprite).toMatchObject({ key: 'back' })
    })

    it('toggles the abilities and measurements sections, open by default', () => {
      const store = createTestStore()
      const { result } = renderHook(() => useDetailPage(), {
        wrapper: buildWrapper(store),
      })

      expect(result.current.isAbilitiesOpen).toBe(true)
      expect(result.current.isMeasurementsOpen).toBe(true)

      act(() => result.current.handleToggleAbilities())
      act(() => result.current.handleToggleMeasurements())

      expect(result.current.isAbilitiesOpen).toBe(false)
      expect(result.current.isMeasurementsOpen).toBe(false)
    })

    it('wires favorite state from the detail id/name', () => {
      const store = createTestStore({
        favorites: { entries: [{ id: 25, name: 'pikachu' }] },
      })
      const { result } = renderHook(() => useDetailPage(), {
        wrapper: buildWrapper(store),
      })

      expect(result.current.isFavorite).toBe(true)

      act(() => result.current.handleToggleClick())
      expect(result.current.modalMessage).toBe('Remove pikachu from your team?')
    })
  })
})
