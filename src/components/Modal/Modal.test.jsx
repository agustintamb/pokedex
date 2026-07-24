import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/render'
import { Modal } from './index'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal
        isOpen={false}
        message="Remove from team?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the message and default action labels when open', () => {
    render(
      <Modal isOpen message="Remove from team?" onConfirm={vi.fn()} onCancel={vi.fn()} />,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Remove from team?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('renders custom action labels', () => {
    render(
      <Modal
        isOpen
        message="Remove from team?"
        confirmLabel="Remove"
        cancelLabel="Keep"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument()
  })

  it('calls onConfirm when the confirm button is clicked', async () => {
    const user = userEvent.setup()
    const handleConfirm = vi.fn()
    render(
      <Modal
        isOpen
        message="Remove from team?"
        onConfirm={handleConfirm}
        onCancel={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when the cancel button is clicked', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()
    render(
      <Modal
        isOpen
        message="Remove from team?"
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when clicking the backdrop', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()
    render(
      <Modal
        isOpen
        message="Remove from team?"
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />,
    )

    await user.click(screen.getByRole('dialog').parentElement)

    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it('does not call onCancel when clicking inside the panel', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()
    render(
      <Modal
        isOpen
        message="Remove from team?"
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />,
    )

    await user.click(screen.getByText('Remove from team?'))

    expect(handleCancel).not.toHaveBeenCalled()
  })

  it('calls onCancel when pressing Escape', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()
    render(
      <Modal
        isOpen
        message="Remove from team?"
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />,
    )

    await user.keyboard('{Escape}')

    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it('ignores keys other than Escape', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()
    render(
      <Modal
        isOpen
        message="Remove from team?"
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />,
    )

    await user.keyboard('{Enter}')

    expect(handleCancel).not.toHaveBeenCalled()
  })

  it('does not listen for Escape while closed', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()
    render(
      <Modal
        isOpen={false}
        message="Remove from team?"
        onConfirm={vi.fn()}
        onCancel={handleCancel}
      />,
    )

    await user.keyboard('{Escape}')

    expect(handleCancel).not.toHaveBeenCalled()
  })
})
