import { describe, it, expect } from 'vitest'
import { render } from '@/test/render'
import { Pokeball } from './index'

describe('Pokeball', () => {
  it('renders active and inactive states without crashing', () => {
    const { rerender, container } = render(<Pokeball isActive={false} size="28px" />)
    expect(container.firstChild).toBeInTheDocument()

    rerender(<Pokeball isActive size="40px" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with the default size when none is given', () => {
    const { container } = render(<Pokeball isActive={false} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
