import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/render'
import { VersusPage } from './index'

describe('VersusPage', () => {
  it('renders the coming-soon empty state', () => {
    render(<VersusPage />)
    expect(screen.getByText('Coming soon.')).toBeInTheDocument()
  })
})
