import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDetailChange } from './useDetailChange'

describe('useDetailChange', () => {
  it('calls onDetailChange when detail.id changes', () => {
    const onDetailChange = vi.fn()
    const { rerender } = renderHook(
      ({ detail }) => useDetailChange(detail, onDetailChange),
      {
        initialProps: { detail: { id: 1 } },
      },
    )

    expect(onDetailChange).not.toHaveBeenCalled()

    rerender({ detail: { id: 2 } })

    expect(onDetailChange).toHaveBeenCalledOnce()
  })

  it('does not call onDetailChange when detail.id stays the same', () => {
    const onDetailChange = vi.fn()
    const { rerender } = renderHook(
      ({ detail }) => useDetailChange(detail, onDetailChange),
      {
        initialProps: { detail: { id: 1 } },
      },
    )

    rerender({ detail: { id: 1 } })

    expect(onDetailChange).not.toHaveBeenCalled()
  })

  it('handles null detail', () => {
    const onDetailChange = vi.fn()
    const { rerender } = renderHook(
      ({ detail }) => useDetailChange(detail, onDetailChange),
      {
        initialProps: { detail: null },
      },
    )

    rerender({ detail: { id: 1 } })

    expect(onDetailChange).toHaveBeenCalledOnce()
  })
})
