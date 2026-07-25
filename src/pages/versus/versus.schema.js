import * as Yup from 'yup'

// validNames: valida que solo existan Pokémon reales (no solo que sean distintos)
export const buildVersusSchema = (validNames) =>
  Yup.object({
    pokemonA: Yup.string().oneOf(validNames, 'Pick a Pokémon from the list').required(),
    pokemonB: Yup.string()
      .oneOf(validNames, 'Pick a Pokémon from the list')
      .required()
      .notOneOf([Yup.ref('pokemonA')], 'Pick two different Pokémon'),
  })
