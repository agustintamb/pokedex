import { describe, it, expect } from 'vitest'
import { getTeamSlots } from './team-slots'

describe('getTeamSlots', () => {
  it('pads an empty list with nulls', () => {
    expect(getTeamSlots([], 6)).toEqual([null, null, null, null, null, null])
  })

  it('keeps existing entries in order and pads the rest with null', () => {
    const favorites = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ]
    expect(getTeamSlots(favorites, 6)).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      null,
      null,
      null,
      null,
    ])
  })

  it('returns exactly `size` slots when favorites already fills it', () => {
    const favorites = Array.from({ length: 6 }, (_, index) => ({
      id: index,
      name: `mon-${index}`,
    }))
    expect(getTeamSlots(favorites, 6)).toEqual(favorites)
  })
})
