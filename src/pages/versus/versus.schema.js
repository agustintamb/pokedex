import * as Yup from 'yup'

export const buildVersusSchema = (validNames) =>
  Yup.object({
    pokemonA: Yup.string().oneOf(validNames, 'Pick a Pokémon from the list').required(),
    pokemonB: Yup.string()
      .oneOf(validNames, 'Pick a Pokémon from the list')
      .required()
      .notOneOf([Yup.ref('pokemonA')], 'Pick two different Pokémon'),
  })
