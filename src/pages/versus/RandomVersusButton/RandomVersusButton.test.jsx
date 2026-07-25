import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/render'
import { RandomVersusButton } from './index'

// lottie-react/lottie-web dependen de canvas/rAF reales que jsdom no provee bien —
// se mockea el componente entero (mismo criterio que NotFoundPage.test.jsx)
vi.mock('lottie-react', () => ({
  default: () => <div>lottie-mock</div>,
}))

describe('RandomVersusButton', () => {
  it('renders an accessible button with a tooltip', () => {
    render(<RandomVersusButton onClick={vi.fn()} />)

    expect(
      screen.getByRole('button', { name: 'Generate random versus' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Generate random versus')).toHaveAttribute('role', 'tooltip')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<RandomVersusButton onClick={handleClick} />)

    await user.click(screen.getByRole('button', { name: 'Generate random versus' }))

    expect(handleClick).toHaveBeenCalledOnce()
  })
})
