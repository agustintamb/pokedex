import { describe, it, expect } from 'vitest'
import { useTypeBadge } from './useTypeBadge'

describe('useTypeBadge', () => {
  it('returns the type color and the type name as the label', () => {
    expect(useTypeBadge({ type: 'water' })).toEqual({ color: '#6890F0', label: 'water' })
  })

  it('falls back to the default color for an unknown type', () => {
    expect(useTypeBadge({ type: 'unknown' }).color).toBe('#777777')
  })
})
