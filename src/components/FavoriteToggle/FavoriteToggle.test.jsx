import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/render'
import { FavoriteToggle } from './index'

describe('FavoriteToggle', () => {
  it('reflects the favorite state via aria-pressed and label', () => {
    render(<FavoriteToggle isFavorite onClick={vi.fn()} name="pikachu" />)
    const button = screen.getByRole('button', { name: 'Remove pikachu from team' })
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('reflects the not-favorite state', () => {
    render(<FavoriteToggle isFavorite={false} onClick={vi.fn()} name="pikachu" />)
    const button = screen.getByRole('button', { name: 'Add pikachu to team' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onClick without letting the click bubble to an ancestor', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    const handleAncestorClick = vi.fn()
    render(
      <div onClick={handleAncestorClick}>
        <FavoriteToggle isFavorite onClick={handleClick} name="pikachu" />
      </div>,
    )
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleAncestorClick).not.toHaveBeenCalled()
  })
})
