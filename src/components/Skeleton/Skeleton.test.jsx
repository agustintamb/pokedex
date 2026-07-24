import { describe, it, expect } from 'vitest'
import { render } from '@/test/render'
import { Skeleton } from './index'

describe('Skeleton', () => {
  it('renders with custom dimensions', () => {
    const { container } = render(<Skeleton $height="24px" $width="60%" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders in inset mode', () => {
    const { container } = render(<Skeleton $inset />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
