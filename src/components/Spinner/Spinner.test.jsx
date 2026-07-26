import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/render'
import { Spinner } from './index'

describe('Spinner', () => {
  it('is decorative when no label is given', () => {
    const { container } = render(<Spinner />)

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('announces itself when a label is given', () => {
    render(<Spinner label="Loading" />)

    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  it('takes a custom label', () => {
    render(<Spinner label="Fetching Pokémon" />)

    expect(screen.getByRole('status', { name: 'Fetching Pokémon' })).toBeInTheDocument()
  })
})
