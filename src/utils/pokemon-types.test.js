import { describe, it, expect } from 'vitest'
import { getTypeColor, POKEMON_TYPE_NAMES } from './pokemon-types'

describe('getTypeColor', () => {
  it('returns the known color for a valid type', () => {
    expect(getTypeColor('fire')).toBe('#F08030')
    expect(getTypeColor('water')).toBe('#6890F0')
  })

  it('falls back to the default color for an unknown type', () => {
    expect(getTypeColor('unknown')).toBe('#777777')
  })
})

describe('POKEMON_TYPE_NAMES', () => {
  it('includes every color-mapped type name, without duplicates', () => {
    expect(POKEMON_TYPE_NAMES).toContain('fire')
    expect(POKEMON_TYPE_NAMES).toContain('fairy')
    expect(new Set(POKEMON_TYPE_NAMES).size).toBe(POKEMON_TYPE_NAMES.length)
  })
})
