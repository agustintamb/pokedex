import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/render'
import { FilterChip } from './index'

describe('FilterChip', () => {
  it('renders the label', () => {
    render(<FilterChip label="fire" isActive={false} onClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'fire' })).toBeInTheDocument()
  })

  it('is a native button', () => {
    render(<FilterChip label="fire" isActive={false} onClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'fire' })).toHaveAttribute('type', 'button')
  })

  it('calls onClick when clicked, active or not', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<FilterChip label="fire" isActive onClick={handleClick} color="#F08030" />)

    await user.click(screen.getByRole('button', { name: 'fire' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders when active without a custom color', () => {
    render(<FilterChip label="all" isActive onClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'all' })).toBeInTheDocument()
  })
})
