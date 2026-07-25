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
  // Separados porque solo uno se invalida: las listas pueden crecer (Pokémon nuevos), el
  // detalle de un Pokémon no cambia y es lo que sostiene el modo offline.
  tagTypes: ['Pokemon', 'PokemonList'],
  endpoints: (builder) => ({
    getPokemonIndex: builder.query({
      query: () => 'pokemon?limit=100000',
      transformResponse: (response) =>
        response.results.map(({ name, url }) => ({ name, id: getIdFromUrl(url) })),
      providesTags: [{ type: 'PokemonList', id: 'index' }],
    }),
    getPokemonDetail: builder.query({
      query: (nameOrId) => `pokemon/${nameOrId}`,
      transformResponse: normalizePokemonDetail,
      providesTags: (result, error, nameOrId) => [{ type: 'Pokemon', id: nameOrId }],
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
      providesTags: (result, error, names) =>
        names.map((name) => ({ type: 'Pokemon', id: name })),
    }),
    getPokemonByType: builder.query({
      query: (type) => `type/${type}`,
      transformResponse: (response) =>
        response.pokemon.map(({ pokemon }) => pokemon.name),
      providesTags: (result, error, type) => [
        { type: 'PokemonList', id: `type:${type}` },
      ],
    }),
    getPokemonByGeneration: builder.query({
      query: (generation) => `generation/${generation}`,
      transformResponse: (response) => response.pokemon_species.map(({ name }) => name),
      providesTags: (result, error, generation) => [
        { type: 'PokemonList', id: `generation:${generation}` },
      ],
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
      providesTags: (result, error, types) =>
        types.map((type) => ({ type: 'PokemonList', id: `type:${type}` })),
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
      providesTags: (result, error, generations) =>
        generations.map((generation) => ({
          type: 'PokemonList',
          id: `generation:${generation}`,
        })),
    }),
  }),
})

export const {
  useGetPokemonIndexQuery,
  useGetPokemonDetailQuery,
  useGetPokemonDetailsQuery,
  useGetPokemonByTypesQuery,
  useGetPokemonByGenerationsQuery,
} = pokeApi

export const selectHasCachedData = (state) =>
  Object.values(state[pokeApi.reducerPath]?.queries ?? {}).some(
    (entry) => entry?.status === 'fulfilled',
  )
