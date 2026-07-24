import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/render'
import { SpriteViewer } from './index'

const sprites = [
  { key: 'front', label: 'Front', src: 'front.png' },
  { key: 'back', label: 'Back', src: 'back.png' },
]

describe('SpriteViewer', () => {
  it('renders nothing when there is no selected sprite', () => {
    const { container } = render(
      <SpriteViewer
        sprites={sprites}
        selected={null}
        selectedKey={null}
        onSelect={vi.fn()}
        alt="pikachu"
      />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the selected sprite image and a tab per sprite', () => {
    render(
      <SpriteViewer
        sprites={sprites}
        selected={sprites[0]}
        selectedKey="front"
        onSelect={vi.fn()}
        alt="pikachu"
      />,
    )
    expect(screen.getByRole('img', { name: 'pikachu Front' })).toHaveAttribute(
      'src',
      'front.png',
    )
    expect(screen.getByRole('button', { name: 'Front' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
  })

  it('calls onSelect with the clicked tab key', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    render(
      <SpriteViewer
        sprites={sprites}
        selected={sprites[0]}
        selectedKey="front"
        onSelect={handleSelect}
        alt="pikachu"
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Back' }))
    expect(handleSelect).toHaveBeenCalledWith('back')
  })
})
