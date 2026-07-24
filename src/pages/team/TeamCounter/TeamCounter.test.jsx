import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/render'
import { TeamCounter } from './index'

describe('TeamCounter', () => {
  it('renders the current count over the max', () => {
    render(<TeamCounter count={3} max={6} />)
    expect(screen.getByText('3/6')).toBeInTheDocument()
  })

  it('renders correctly at the max', () => {
    render(<TeamCounter count={6} max={6} />)
    expect(screen.getByText('6/6')).toBeInTheDocument()
  })
})
