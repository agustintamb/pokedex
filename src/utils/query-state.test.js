import { describe, it, expect } from 'vitest'
import { getIsRetrying } from './query-state'

describe('getIsRetrying', () => {
  it('is true while a request is in flight with nothing to show', () => {
    expect(getIsRetrying({ isLoading: false, isFetching: true, hasData: false })).toBe(
      true,
    )
  })

  it('is false on the first load, which is already covered by isLoading', () => {
    expect(getIsRetrying({ isLoading: true, isFetching: true, hasData: false })).toBe(
      false,
    )
  })

  it('is false while refetching over data that is already on screen', () => {
    expect(getIsRetrying({ isLoading: false, isFetching: true, hasData: true })).toBe(
      false,
    )
  })

  it('is false when there is no request in flight', () => {
    expect(getIsRetrying({ isLoading: false, isFetching: false, hasData: false })).toBe(
      false,
    )
  })

  it('treats a missing isFetching as not retrying', () => {
    expect(getIsRetrying({ isLoading: false, hasData: false })).toBe(false)
  })
})
