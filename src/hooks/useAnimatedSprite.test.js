import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnimatedSprite } from './useAnimatedSprite'

describe('useAnimatedSprite', () => {
  it('asks for the animated sprite first', () => {
    const { result } = renderHook(() => useAnimatedSprite(25))

    expect(result.current.src).toContain('animated')
    expect(result.current.isStatic).toBe(false)
  })

  it('falls back to the static sprite after an error', () => {
    const { result } = renderHook(() => useAnimatedSprite(25))

    act(() => result.current.onError())

    expect(result.current.src).not.toContain('animated')
    expect(result.current.src).toContain('25.png')
    expect(result.current.isStatic).toBe(true)
  })

  it('retries the animated sprite when the id changes', () => {
    const { result, rerender } = renderHook(({ id }) => useAnimatedSprite(id), {
      initialProps: { id: 25 },
    })
    act(() => result.current.onError())
    expect(result.current.isStatic).toBe(true)

    rerender({ id: 4 })

    expect(result.current.src).toContain('animated')
    expect(result.current.isStatic).toBe(false)
  })

  it('returns no src when there is no id yet', () => {
    const { result } = renderHook(() => useAnimatedSprite(undefined))

    expect(result.current.src).toBeNull()
  })
})
