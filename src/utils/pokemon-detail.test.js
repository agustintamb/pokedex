import { describe, it, expect } from 'vitest'
import { normalizePokemonDetail } from './pokemon-detail'

const buildResponse = (overrides = {}) => ({
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: [{ type: { name: 'electric' } }],
  abilities: [
    { ability: { name: 'static' }, is_hidden: false },
    { ability: { name: 'lightning-rod' }, is_hidden: true },
  ],
  stats: [
    { base_stat: 35, stat: { name: 'hp' } },
    { base_stat: 55, stat: { name: 'attack' } },
  ],
  sprites: {
    front_default: 'front.png',
    front_shiny: 'front-shiny.png',
    front_female: null,
    front_shiny_female: null,
    back_default: 'back.png',
    back_shiny: 'back-shiny.png',
    back_female: null,
    back_shiny_female: null,
    other: {
      'official-artwork': {
        front_default: 'artwork.png',
        front_shiny: 'artwork-shiny.png',
      },
    },
  },
  ...overrides,
})

describe('normalizePokemonDetail', () => {
  it('flattens types, abilities and stats into simple shapes', () => {
    const result = normalizePokemonDetail(buildResponse())

    expect(result.id).toBe(25)
    expect(result.name).toBe('pikachu')
    expect(result.height).toBe(4)
    expect(result.weight).toBe(60)
    expect(result.types).toEqual(['electric'])
    expect(result.abilities).toEqual([
      { name: 'static', isHidden: false },
      { name: 'lightning-rod', isHidden: true },
    ])
    expect(result.stats).toEqual([
      { name: 'hp', value: 35 },
      { name: 'attack', value: 55 },
    ])
  })

  it('maps sprite fields, including official artwork', () => {
    const result = normalizePokemonDetail(buildResponse())

    expect(result.sprites).toEqual({
      front: 'front.png',
      frontShiny: 'front-shiny.png',
      frontFemale: null,
      frontShinyFemale: null,
      back: 'back.png',
      backShiny: 'back-shiny.png',
      backFemale: null,
      backShinyFemale: null,
      artwork: 'artwork.png',
      artworkShiny: 'artwork-shiny.png',
    })
  })

  it('leaves artwork fields undefined when sprites.other is missing', () => {
    const response = buildResponse()
    delete response.sprites.other

    const result = normalizePokemonDetail(response)

    expect(result.sprites.artwork).toBeUndefined()
    expect(result.sprites.artworkShiny).toBeUndefined()
  })
})
