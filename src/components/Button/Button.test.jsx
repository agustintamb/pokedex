import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Link } from 'react-router-dom'
import { renderWithProviders, screen } from '@/test/render'
import { Button } from './index'

describe('Button', () => {
  it('renders children and calls onClick', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    renderWithProviders(<Button onClick={handleClick}>Confirm</Button>)

    const button = screen.getByRole('button', { name: 'Confirm' })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('defaults to the primary variant', () => {
    renderWithProviders(<Button>Confirm</Button>)
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it.each(['primary', 'secondary', 'muted', 'link'])(
    'renders without crashing with variant="%s"',
    (variant) => {
      renderWithProviders(<Button variant={variant}>Label</Button>)
      expect(screen.getByText('Label')).toBeInTheDocument()
    },
  )

  it('shows a spinner instead of children and disables the button while loading', () => {
    renderWithProviders(<Button isLoading>Retry</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(screen.queryByText('Retry')).not.toBeInTheDocument()
  })

  it('respects an explicit disabled prop even when not loading', () => {
    renderWithProviders(<Button disabled>Confirm</Button>)
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  })

  it('renders as a router Link when given "as"', () => {
    renderWithProviders(
      <Button as={Link} to="/" variant="link">
        Back home
      </Button>,
    )

    expect(screen.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/')
  })
})
