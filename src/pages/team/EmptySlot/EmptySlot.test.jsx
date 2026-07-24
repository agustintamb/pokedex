import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/render'
import { EmptySlot } from './index'

describe('EmptySlot', () => {
  it('renders the empty-slot label', () => {
    render(<EmptySlot />)
    expect(screen.getByText('Empty slot')).toBeInTheDocument()
  })
})
