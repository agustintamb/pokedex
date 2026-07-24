import { describe, it, expect } from 'vitest'
import { parseListParam } from './parse-list-param'

describe('parseListParam', () => {
  it('splits a comma-separated value into an array', () => {
    expect(parseListParam('fire,water,grass')).toEqual(['fire', 'water', 'grass'])
  })

  it('returns a single-item array for a value with no commas', () => {
    expect(parseListParam('fire')).toEqual(['fire'])
  })

  it('filters out empty entries from a trailing/leading comma', () => {
    expect(parseListParam('fire,,water,')).toEqual(['fire', 'water'])
  })

  it('returns an empty array for null or undefined', () => {
    expect(parseListParam(null)).toEqual([])
    expect(parseListParam(undefined)).toEqual([])
  })

  it('returns an empty array for an empty string', () => {
    expect(parseListParam('')).toEqual([])
  })
})
