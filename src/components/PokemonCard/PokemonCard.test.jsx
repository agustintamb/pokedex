import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, fireEvent } from '@/test/render'
import { useGetPokemonDetailQuery } from '@/api/pokeApi'
import { PokemonCard } from './index'

// Mockea el hook de pokeApi en el límite del módulo, en vez de correr la query real —
// no hay MSW en el proyecto, y esto alcanza para testear cómo PokemonCard consume el
// resultado, sin depender de la capa de red
vi.mock('@/api/pokeApi', () => ({
  useGetPokemonDetailQuery: vi.fn(),
}))

describe('PokemonCard', () => {
  beforeEach(() => {
    useGetPokemonDetailQuery.mockReturnValue({
      data: { types: ['electric'] },
      isLoading: false,
    })
  })

  it('links to the detail page', () => {
    renderWithProviders(<PokemonCard id={25} name="pikachu" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/pokemon/pikachu')
  })

  it('renders the dex number and name', () => {
    renderWithProviders(<PokemonCard id={25} name="pikachu" />)
    expect(screen.getByText('N.º 025')).toBeInTheDocument()
    expect(screen.getByText('pikachu')).toBeInTheDocument()
  })

  it('renders a skeleton instead of type badges while loading', () => {
    useGetPokemonDetailQuery.mockReturnValue({ data: undefined, isLoading: true })
    renderWithProviders(<PokemonCard id={25} name="pikachu" />)
    expect(screen.queryByText('electric')).not.toBeInTheDocument()
  })

  it('renders type badges once the detail has loaded', () => {
    renderWithProviders(<PokemonCard id={25} name="pikachu" />)
    expect(screen.getByText('electric')).toBeInTheDocument()
  })

  it('opens the add-to-team modal when the favorite toggle is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PokemonCard id={25} name="pikachu" />)

    await user.click(screen.getByRole('button', { name: 'Add pikachu to team' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Add pikachu to your team?')).toBeInTheDocument()
  })

  it('offers to remove instead of add when already a favorite', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PokemonCard id={25} name="pikachu" />, {
      preloadedState: { favorites: { entries: [{ id: 25, name: 'pikachu' }] } },
    })

    await user.click(screen.getByRole('button', { name: 'Remove pikachu from team' }))

    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
    expect(screen.getByText('Remove pikachu from your team?')).toBeInTheDocument()
  })

  it('removes the loading skeleton once the sprite fires onLoad', () => {
    renderWithProviders(<PokemonCard id={9001} name="some-modern-mon" />)
    const sprite = screen.getByRole('img')
    expect(sprite.parentElement.children).toHaveLength(2)

    fireEvent.load(sprite)

    expect(sprite.parentElement.children).toHaveLength(1)
  })
})
