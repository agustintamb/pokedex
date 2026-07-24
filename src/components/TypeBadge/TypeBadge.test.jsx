import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/render'
import { TypeBadge } from './index'

describe('TypeBadge', () => {
  it('renders the type name as its label', () => {
    render(<TypeBadge type="fire" />)
    expect(screen.getByText('fire')).toBeInTheDocument()
  })
})
