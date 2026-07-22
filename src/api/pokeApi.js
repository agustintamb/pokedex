import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getIdFromUrl } from '@/utils/pokemon-url'

const BASE_URL = 'https://pokeapi.co/api/v2/'
const ONE_DAY_IN_SECONDS = 60 * 60 * 24

export const pokeApi = createApi({
  reducerPath: 'pokeApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  keepUnusedDataFor: ONE_DAY_IN_SECONDS,
  endpoints: (builder) => ({
    getPokemonIndex: builder.query({
      query: () => 'pokemon?limit=100000&offset=0',
      transformResponse: (response) =>
        response.results.map(({ name, url }) => ({ name, id: getIdFromUrl(url) })),
    }),
    getPokemonDetail: builder.query({
      query: (nameOrId) => `pokemon/${nameOrId}`,
    }),
    getPokemonByType: builder.query({
      query: (type) => `type/${type}`,
      transformResponse: (response) =>
        response.pokemon.map(({ pokemon }) => pokemon.name),
    }),
    getPokemonByGeneration: builder.query({
      query: (generation) => `generation/${generation}`,
      transformResponse: (response) => response.pokemon_species.map(({ name }) => name),
    }),
    getTypes: builder.query({
      query: () => 'type',
      transformResponse: (response) => response.results,
    }),
    getGenerations: builder.query({
      query: () => 'generation',
      transformResponse: (response) => response.results,
    }),
  }),
})

export const {
  useGetPokemonIndexQuery,
  useGetPokemonDetailQuery,
  useGetPokemonByTypeQuery,
  useGetPokemonByGenerationQuery,
  useGetTypesQuery,
  useGetGenerationsQuery,
} = pokeApi
