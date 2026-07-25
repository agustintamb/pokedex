import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/render'
import { Loader } from './index'

describe('Loader', () => {
  it('renders an accessible loading status', () => {
    render(<Loader />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  it('uses a custom label when given', () => {
    render(<Loader label="Fetching Pokémon" />)
    expect(screen.getByRole('status', { name: 'Fetching Pokémon' })).toBeInTheDocument()
  })
})
