import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useStatBar } from './useStatBar'

describe('useStatBar', () => {
  it('starts at 0 and animates to the target percentage', async () => {
    const { result } = renderHook(() => useStatBar({ value: 127.5 }))
    expect(result.current.percentage).toBe(0)
    await waitFor(() => expect(result.current.percentage).toBe(50))
  })

  it('caps the percentage at 100 for values above the max', async () => {
    const { result } = renderHook(() => useStatBar({ value: 300 }))
    await waitFor(() => expect(result.current.percentage).toBe(100))
  })
})
