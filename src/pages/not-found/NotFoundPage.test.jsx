import { describe, it, expect, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/render'
import { NotFoundPage } from './index'

// lottie-react/lottie-web dependen de canvas/rAF reales que jsdom no provee bien —
// se mockea el componente entero, no es lo que este test necesita verificar
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
