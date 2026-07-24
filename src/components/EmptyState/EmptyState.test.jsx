import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/render'
import { EmptyState } from './index'

describe('EmptyState', () => {
  it('renders the title glyph and message by default', () => {
    render(<EmptyState title="∅" message="Nothing here" />)
    expect(screen.getByText('∅')).toBeInTheDocument()
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('renders a custom illustration instead of the title glyph', () => {
    render(
      <EmptyState illustration={<span>custom-art</span>} title="∅" message="Empty" />,
    )
    expect(screen.queryByText('∅')).not.toBeInTheDocument()
    expect(screen.getByText('custom-art')).toBeInTheDocument()
  })

  it('renders no illustration at all when illustration is false', () => {
    render(<EmptyState illustration={false} title="∅" message="Empty" />)
    expect(screen.queryByText('∅')).not.toBeInTheDocument()
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })
})
