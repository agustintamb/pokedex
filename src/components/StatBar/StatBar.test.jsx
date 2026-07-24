import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/render'
import { StatBar } from './index'

describe('StatBar', () => {
  it('renders the label and the raw value', () => {
    render(<StatBar label="HP" value={45} />)
    expect(screen.getByText('HP')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
  })
})
