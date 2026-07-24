import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSnackbarItem } from './useSnackbarItem'

describe('useSnackbarItem', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('calls dismiss with the id after the auto-dismiss delay', () => {
    const dismiss = vi.fn()
    renderHook(() => useSnackbarItem('id-1', dismiss))

    expect(dismiss).not.toHaveBeenCalled()
    vi.advanceTimersByTime(2500)
    expect(dismiss).toHaveBeenCalledWith('id-1')
  })

  it('does not call dismiss if unmounted before the delay', () => {
    const dismiss = vi.fn()
    const { unmount } = renderHook(() => useSnackbarItem('id-1', dismiss))

    unmount()
    vi.advanceTimersByTime(2500)

    expect(dismiss).not.toHaveBeenCalled()
  })
})
