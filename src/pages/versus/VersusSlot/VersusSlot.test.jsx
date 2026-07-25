import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders as render, screen, fireEvent } from '@/test/render'
import { VersusSlot } from './index'

const baseProps = {
  label: 'Pokemon 1',
  query: '',
  suggestions: [],
  detail: undefined,
  isLoading: false,
  onQueryChange: vi.fn(),
  onSelectOption: vi.fn(),
  onDismiss: vi.fn(),
  onFocus: vi.fn(),
}

const detailFixture = {
  id: 25,
  name: 'pikachu',
  sprites: { artwork: 'artwork.png', front: 'front.png' },
}

const otherDetailFixture = {
  id: 4,
  name: 'charmander',
  sprites: { artwork: 'artwork-charmander.png', front: 'front-charmander.png' },
}

describe('VersusSlot', () => {
  it('renders the empty-slot placeholder with the given label when nothing is picked', () => {
    render(<VersusSlot {...baseProps} />)

    expect(screen.getByText('Pokemon 1')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders a loading skeleton while the detail is being fetched', () => {
    render(<VersusSlot {...baseProps} isLoading />)

    expect(screen.queryByText('Pokemon 1')).not.toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders the sprite and name once a Pokémon is picked', () => {
    render(<VersusSlot {...baseProps} detail={detailFixture} />)

    expect(screen.getByText('pikachu')).toBeInTheDocument()
    expect(screen.getByAltText('pikachu')).toBeInTheDocument()
  })

  it('links the name to the Pokémon detail page', () => {
    render(<VersusSlot {...baseProps} detail={detailFixture} />)

    expect(screen.getByText('pikachu')).toHaveAttribute('href', '/pokemon/pikachu')
  })

  it('falls back to the static sprite if the animated one fails to load', () => {
    render(<VersusSlot {...baseProps} detail={detailFixture} />)

    const sprite = screen.getByAltText('pikachu')
    fireEvent.error(sprite)

    expect(sprite).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    )
  })

  it('resets the static-sprite fallback when switching to a different Pokémon', () => {
    const { rerender } = render(<VersusSlot {...baseProps} detail={detailFixture} />)

    fireEvent.error(screen.getByAltText('pikachu'))
    expect(screen.getByAltText('pikachu')).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    )

    rerender(<VersusSlot {...baseProps} detail={otherDetailFixture} />)

    expect(screen.getByAltText('charmander')).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif',
    )
  })

  it('passes the search props through to SearchSelect', () => {
    const handleQueryChange = vi.fn()
    render(<VersusSlot {...baseProps} onQueryChange={handleQueryChange} />)

    fireEvent.change(screen.getByPlaceholderText('Search Pokemon 1'), {
      target: { value: 'pika' },
    })

    expect(handleQueryChange).toHaveBeenCalledWith('pika')
  })
})
