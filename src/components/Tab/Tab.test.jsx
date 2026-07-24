import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/render'
import { Tab, Tabs } from './index'

describe('Tab', () => {
  it('renders its children as the button label', () => {
    render(<Tab isActive={false}>Front</Tab>)
    expect(screen.getByRole('button', { name: 'Front' })).toBeInTheDocument()
  })

  it('is a native button, not a submit control', () => {
    render(<Tab isActive={false}>Front</Tab>)
    expect(screen.getByRole('button', { name: 'Front' })).toHaveAttribute(
      'type',
      'button',
    )
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Tab isActive={false} onClick={handleClick}>
        Front
      </Tab>,
    )

    await user.click(screen.getByRole('button', { name: 'Front' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})

describe('Tabs', () => {
  it('renders every child passed to it', () => {
    render(
      <Tabs>
        <Tab isActive>Front</Tab>
        <Tab isActive={false}>Back</Tab>
      </Tabs>,
    )

    expect(screen.getByRole('button', { name: 'Front' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
  })
})
