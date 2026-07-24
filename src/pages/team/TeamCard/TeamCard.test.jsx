import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, fireEvent } from '@/test/render'
import { TeamCard } from './index'

const preloadedState = { favorites: { entries: [{ id: 25, name: 'pikachu' }] } }

describe('TeamCard', () => {
  it("links to the Pokémon's detail page via its name", () => {
    renderWithProviders(<TeamCard id={25} name="pikachu" />, { preloadedState })
    expect(screen.getByRole('link', { name: 'pikachu' })).toHaveAttribute(
      'href',
      '/pokemon/pikachu',
    )
  })

  it('requests the animated sprite first', () => {
    renderWithProviders(<TeamCard id={25} name="pikachu" />, { preloadedState })
    expect(screen.getByRole('img').getAttribute('src')).toContain('animated')
  })

  it('falls back to the static sprite when the animated one fails to load', () => {
    renderWithProviders(<TeamCard id={25} name="pikachu" />, { preloadedState })
    const sprite = screen.getByRole('img')

    fireEvent.error(sprite)

    expect(sprite.getAttribute('src')).not.toContain('animated')
    expect(sprite.getAttribute('src')).toContain('25.png')
  })

  it('opens the remove-from-team confirm modal when the pokeball is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TeamCard id={25} name="pikachu" />, { preloadedState })

    await user.click(screen.getByRole('button', { name: 'Remove pikachu from team' }))

    expect(screen.getByText('Remove pikachu from your team?')).toBeInTheDocument()
  })
})
