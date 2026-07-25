import { describe, it, expect } from 'vitest'
import { render } from '@/test/render'
import { Spinner } from './index'

describe('Spinner', () => {
  it('renders a decorative rotating glyph', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })
})
