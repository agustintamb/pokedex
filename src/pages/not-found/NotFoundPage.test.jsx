import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/render'
import { NotFoundPage } from './index'

// lottie-react depende de canvas/rAF que jsdom no provee bien — se mockea entero
vi.mock('lottie-react', () => ({
  default: () => <div>lottie-mock</div>,
}))

describe('NotFoundPage', () => {
  it('renders the not-found message and a link back home', () => {
    renderWithProviders(<NotFoundPage />)
    expect(screen.getByText("This page doesn't exist.")).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to the Pokédex' })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
