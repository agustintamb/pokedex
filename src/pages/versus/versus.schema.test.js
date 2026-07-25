import { describe, it, expect } from 'vitest'
import { buildVersusSchema } from './versus.schema'

const validNames = ['pikachu', 'charmander', 'bulbasaur']

describe('buildVersusSchema', () => {
  it('accepts two different, known Pokémon', async () => {
    const schema = buildVersusSchema(validNames)
    await expect(
      schema.validate({ pokemonA: 'pikachu', pokemonB: 'charmander' }),
    ).resolves.toBeDefined()
  })

  it('rejects when both fields are the same Pokémon', async () => {
    const schema = buildVersusSchema(validNames)
    await expect(
      schema.validate({ pokemonA: 'pikachu', pokemonB: 'pikachu' }),
    ).rejects.toThrow()
  })

  it('rejects a name that is not in the known index', async () => {
    const schema = buildVersusSchema(validNames)
    await expect(
      schema.validate({ pokemonA: 'missingno', pokemonB: 'charmander' }),
    ).rejects.toThrow()
  })

  it('rejects empty selections', async () => {
    const schema = buildVersusSchema(validNames)
    await expect(schema.validate({ pokemonA: '', pokemonB: '' })).rejects.toThrow()
  })

  // Gotcha: abortEarly:false hace que notOneOf pise al required/oneOf cuando ambos están vacíos
  it('clobbers the required/oneOf message with the duplicate message when both fields are empty (abortEarly: false)', async () => {
    const schema = buildVersusSchema(validNames)
    try {
      await schema.validate({ pokemonA: '', pokemonB: '' }, { abortEarly: false })
      throw new Error('expected validation to reject')
    } catch (error) {
      const pokemonBMessages = error.inner
        .filter((entry) => entry.path === 'pokemonB')
        .map((entry) => entry.message)

      expect(pokemonBMessages).toContain('Pick two different Pokémon')
    }
  })
})
