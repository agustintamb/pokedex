import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/render'
import { EmptySlot } from './index'

describe('EmptySlot', () => {
  it('renders the default "Empty slot" label', () => {
    render(<EmptySlot />)
    expect(screen.getByText('Empty slot')).toBeInTheDocument()
  })

  it('renders a custom label when given one', () => {
    render(<EmptySlot label="Pokemon 1" />)
    expect(screen.getByText('Pokemon 1')).toBeInTheDocument()
    expect(screen.queryByText('Empty slot')).not.toBeInTheDocument()
  })
})
