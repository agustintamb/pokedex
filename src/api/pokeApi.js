import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getIdFromUrl } from '@/utils/pokemon-url'
import { normalizePokemonDetail } from '@/utils/pokemon-detail'

const BASE_URL = 'https://pokeapi.co/api/v2/'
const ONE_DAY_IN_SECONDS = 60 * 60 * 24

export const pokeApi = createApi({
  refetchOnReconnect: true,
  reducerPath: 'pokeApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  keepUnusedDataFor: ONE_DAY_IN_SECONDS,
  endpoints: (builder) => ({
    getPokemonIndex: builder.query({
      query: () => 'pokemon?limit=100000',
      transformResponse: (response) =>
        response.results.map(({ name, url }) => ({ name, id: getIdFromUrl(url) })),
    }),
    getPokemonDetail: builder.query({
      query: (nameOrId) => `pokemon/${nameOrId}`,
      transformResponse: normalizePokemonDetail,
    }),
    getPokemonDetails: builder.query({
      queryFn: async (names, { dispatch }) => {
        if (!names.length) return { data: [] }
        try {
          const results = await Promise.all(
            names.map((name) =>
              dispatch(pokeApi.endpoints.getPokemonDetail.initiate(name)).unwrap(),
            ),
          )
          return { data: results }
        } catch (error) {
          return { error }
        }
      },
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
    getPokemonByTypes: builder.query({
      queryFn: async (types, { dispatch }) => {
        if (!types.length) return { data: [] }
        try {
          const results = await Promise.all(
            types.map((type) =>
              dispatch(pokeApi.endpoints.getPokemonByType.initiate(type)).unwrap(),
            ),
          )
          return { data: [...new Set(results.flat())] }
        } catch (error) {
          return { error }
        }
      },
    }),
    getPokemonByGenerations: builder.query({
      queryFn: async (generations, { dispatch }) => {
        if (!generations.length) return { data: [] }
        try {
          const results = await Promise.all(
            generations.map((generation) =>
              dispatch(
                pokeApi.endpoints.getPokemonByGeneration.initiate(generation),
              ).unwrap(),
            ),
          )
          return { data: [...new Set(results.flat())] }
        } catch (error) {
          return { error }
        }
      },
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
  useGetPokemonDetailsQuery,
  useGetPokemonByTypeQuery,
  useGetPokemonByGenerationQuery,
  useGetPokemonByTypesQuery,
  useGetPokemonByGenerationsQuery,
  useGetTypesQuery,
  useGetGenerationsQuery,
} = pokeApi

// Al menos una query de pokeApi ya resolvió con datos (sea de esta sesión o rehidratada por
// redux-persist) — usado por ConnectionStatus para distinguir "cached" de "nada todavía".
export const selectHasCachedData = (state) =>
  Object.values(state[pokeApi.reducerPath]?.queries ?? {}).some(
    (entry) => entry?.status === 'fulfilled',
  )
