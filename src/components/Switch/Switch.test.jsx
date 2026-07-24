import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/render'
import { Switch } from './index'

describe('Switch', () => {
  it('exposes the switch role with the aria-label it receives', () => {
    render(<Switch isOn={false} ariaLabel="Toggle shiny sprites" />)
    expect(
      screen.getByRole('switch', { name: 'Toggle shiny sprites' }),
    ).toBeInTheDocument()
  })

  it('reflects the on state via aria-checked', () => {
    const { rerender } = render(<Switch isOn={false} ariaLabel="Toggle" />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')

    rerender(<Switch isOn ariaLabel="Toggle" />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Switch isOn={false} ariaLabel="Toggle" onClick={handleClick} />)

    await user.click(screen.getByRole('switch'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
