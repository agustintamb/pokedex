import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderWithProviders, screen, act } from '@/test/render'
import { selectHasCachedData } from '@/api/pokeApi'
import { ConnectionStatus } from './index'

// Se mockea el selector de pokeApi, no un reducer real. `pokeApi.reducerPath` se deja real
// porque ui.slice.js lo usa para armar el nombre de acción.
vi.mock('@/api/pokeApi', () => ({
  pokeApi: { reducerPath: 'pokeApi' },
  selectHasCachedData: vi.fn(),
}))

const setOnLine = (value) =>
  Object.defineProperty(navigator, 'onLine', { value, configurable: true })

describe('ConnectionStatus', () => {
  afterEach(() => setOnLine(true))

  it('shows online with no qualifier when nothing was fetched or cached yet', () => {
    selectHasCachedData.mockReturnValue(false)
    setOnLine(true)
    renderWithProviders(<ConnectionStatus />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Online')
    expect(status).not.toHaveTextContent('fetched')
    expect(status).not.toHaveTextContent('cached')
  })

  it('shows "fetched" once a pokeApi query resolves while online', () => {
    selectHasCachedData.mockReturnValue(true)
    setOnLine(true)
    const { store } = renderWithProviders(<ConnectionStatus />)

    act(() => {
      store.dispatch({ type: 'pokeApi/executeQuery/fulfilled' })
    })

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Online')
    expect(status).toHaveTextContent('fetched')
    expect(status).toHaveAttribute('title', 'Live data')
  })

  it('shows "cached" when online but nothing was fetched this session', () => {
    selectHasCachedData.mockReturnValue(true)
    setOnLine(true)
    renderWithProviders(<ConnectionStatus />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Online')
    expect(status).toHaveTextContent('cached')
  })

  it('shows offline + cached when offline and there is cached data', () => {
    selectHasCachedData.mockReturnValue(true)
    setOnLine(false)
    renderWithProviders(<ConnectionStatus />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Offline')
    expect(status).toHaveTextContent('cached')
    expect(status).toHaveAttribute('title', 'Showing saved (cached) data')
  })

  it('shows offline with no qualifier when there is no cached data at all', () => {
    selectHasCachedData.mockReturnValue(false)
    setOnLine(false)
    renderWithProviders(<ConnectionStatus />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Offline')
    expect(status).not.toHaveTextContent('cached')
  })

  it('reacts to the browser going offline', () => {
    selectHasCachedData.mockReturnValue(false)
    setOnLine(true)
    renderWithProviders(<ConnectionStatus />)
    expect(screen.getByRole('status')).toHaveTextContent('Online')

    act(() => {
      setOnLine(false)
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.getByRole('status')).toHaveTextContent('Offline')
  })
})
