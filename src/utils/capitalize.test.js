import { describe, it, expect } from 'vitest'
import { capitalize } from './capitalize'

describe('capitalize', () => {
  it('uppercases the first letter and keeps the rest as-is', () => {
    expect(capitalize('pikachu')).toBe('Pikachu')
  })

  it('leaves an already-capitalized string unchanged', () => {
    expect(capitalize('Bulbasaur')).toBe('Bulbasaur')
  })

  it('handles a single character', () => {
    expect(capitalize('a')).toBe('A')
  })

  it('handles an empty string', () => {
    expect(capitalize('')).toBe('')
  })
})
