import { describe, it, expect } from 'vitest'
import { POKEMON_GENERATIONS } from './generations'

describe('POKEMON_GENERATIONS', () => {
  it('lists generations 1 through 9 in order', () => {
    expect(POKEMON_GENERATIONS).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
