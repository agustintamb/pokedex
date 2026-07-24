import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/render'
import { Tooltip } from './index'

describe('Tooltip', () => {
  it('renders the trigger children', () => {
    render(
      <Tooltip label="Add to team">
        <button>Pokeball</button>
      </Tooltip>,
    )

    expect(screen.getByRole('button', { name: 'Pokeball' })).toBeInTheDocument()
  })

  it('renders the label in a tooltip element', () => {
    render(
      <Tooltip label="Add to team">
        <button>Pokeball</button>
      </Tooltip>,
    )

    const bubble = screen.getByText('Add to team')
    expect(bubble).toHaveAttribute('role', 'tooltip')
  })
})
