import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { pokeApi, selectHasCachedData } from './pokeApi'

// Se mockea `fetch` global, no el hook de pokeApi (acá se testea pokeApi.js en sí):
// transformResponse y el dedupe/manejo de error de los queryFn compuestos.
const buildStore = () =>
  configureStore({
    reducer: { [pokeApi.reducerPath]: pokeApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokeApi.middleware),
  })

const createFetchMock = (routes) =>
  vi.fn((request) => {
    const url = request.url
    const route = routes[url]
    if (!route) throw new Error(`Unhandled fetch: ${url}`)
    const { status = 200, body } = route
    const text = status === 204 || body === undefined ? '' : JSON.stringify(body)
    return Promise.resolve(
      new Response(text, { status, headers: { 'content-type': 'application/json' } }),
    )
  })

const BASE_URL = 'https://pokeapi.co/api/v2/'

const buildRawDetail = ({ id, name }) => ({
  id,
  name,
  height: 4,
  weight: 60,
  types: [{ type: { name: 'electric' } }],
  abilities: [{ ability: { name: 'static' }, is_hidden: false }],
  stats: [{ base_stat: 35, stat: { name: 'hp' } }],
  sprites: {
    front_default: 'front.png',
    front_shiny: 'front-shiny.png',
    front_female: null,
    front_shiny_female: null,
    back_default: 'back.png',
    back_shiny: 'back-shiny.png',
    back_female: null,
    back_shiny_female: null,
    other: { 'official-artwork': { front_default: 'artwork.png', front_shiny: null } },
  },
})

describe('pokeApi', () => {
  let store

  beforeEach(() => {
    store = buildStore()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('getPokemonIndex maps results to { name, id }', async () => {
    vi.stubGlobal(
      'fetch',
      createFetchMock({
        [`${BASE_URL}pokemon?limit=100000`]: {
          status: 200,
          body: {
            results: [
              { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
              { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
            ],
          },
        },
      }),
    )

    const result = await store
      .dispatch(pokeApi.endpoints.getPokemonIndex.initiate())
      .unwrap()

    expect(result).toEqual([
      { name: 'bulbasaur', id: 1 },
      { name: 'ivysaur', id: 2 },
    ])
  })

  it('selectHasCachedData is false until a query resolves, then true', async () => {
    expect(selectHasCachedData(store.getState())).toBe(false)

    vi.stubGlobal(
      'fetch',
      createFetchMock({
        [`${BASE_URL}pokemon?limit=100000`]: { status: 200, body: { results: [] } },
      }),
    )
    await store.dispatch(pokeApi.endpoints.getPokemonIndex.initiate()).unwrap()

    expect(selectHasCachedData(store.getState())).toBe(true)
  })

  it('getPokemonDetail normalizes the raw payload', async () => {
    vi.stubGlobal(
      'fetch',
      createFetchMock({
        [`${BASE_URL}pokemon/pikachu`]: {
          body: buildRawDetail({ id: 25, name: 'pikachu' }),
        },
      }),
    )

    const result = await store
      .dispatch(pokeApi.endpoints.getPokemonDetail.initiate('pikachu'))
      .unwrap()

    expect(result).toMatchObject({
      id: 25,
      name: 'pikachu',
      types: ['electric'],
      abilities: [{ name: 'static', isHidden: false }],
      stats: [{ name: 'hp', value: 35 }],
      sprites: { front: 'front.png', artwork: 'artwork.png' },
    })
  })

  describe('getPokemonDetails (plural)', () => {
    it('returns an empty array without calling fetch when there are no names', async () => {
      const fetchMock = createFetchMock({})
      vi.stubGlobal('fetch', fetchMock)

      const result = await store
        .dispatch(pokeApi.endpoints.getPokemonDetails.initiate([]))
        .unwrap()

      expect(result).toEqual([])
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('resolves the detail of every requested name', async () => {
      vi.stubGlobal(
        'fetch',
        createFetchMock({
          [`${BASE_URL}pokemon/pikachu`]: {
            body: buildRawDetail({ id: 25, name: 'pikachu' }),
          },
          [`${BASE_URL}pokemon/charmander`]: {
            body: buildRawDetail({ id: 4, name: 'charmander' }),
          },
        }),
      )

      const result = await store
        .dispatch(pokeApi.endpoints.getPokemonDetails.initiate(['pikachu', 'charmander']))
        .unwrap()

      expect(result.map((entry) => entry.name)).toEqual(['pikachu', 'charmander'])
    })

    it('propagates an error when one of the underlying requests fails', async () => {
      vi.stubGlobal(
        'fetch',
        createFetchMock({
          [`${BASE_URL}pokemon/missingno`]: { status: 404 },
        }),
      )

      await expect(
        store
          .dispatch(pokeApi.endpoints.getPokemonDetails.initiate(['missingno']))
          .unwrap(),
      ).rejects.toBeDefined()
    })
  })

  it('getPokemonByType flattens the pokemon list to names', async () => {
    vi.stubGlobal(
      'fetch',
      createFetchMock({
        [`${BASE_URL}type/electric`]: {
          body: {
            pokemon: [{ pokemon: { name: 'pikachu' } }, { pokemon: { name: 'raichu' } }],
          },
        },
      }),
    )

    const result = await store
      .dispatch(pokeApi.endpoints.getPokemonByType.initiate('electric'))
      .unwrap()

    expect(result).toEqual(['pikachu', 'raichu'])
  })

  it('getPokemonByGeneration maps species to names', async () => {
    vi.stubGlobal(
      'fetch',
      createFetchMock({
        [`${BASE_URL}generation/1`]: {
          body: { pokemon_species: [{ name: 'bulbasaur' }, { name: 'charmander' }] },
        },
      }),
    )

    const result = await store
      .dispatch(pokeApi.endpoints.getPokemonByGeneration.initiate('1'))
      .unwrap()

    expect(result).toEqual(['bulbasaur', 'charmander'])
  })

  describe('getPokemonByTypes (plural)', () => {
    it('returns an empty array without calling fetch when there are no types', async () => {
      const fetchMock = createFetchMock({})
      vi.stubGlobal('fetch', fetchMock)

      const result = await store
        .dispatch(pokeApi.endpoints.getPokemonByTypes.initiate([]))
        .unwrap()

      expect(result).toEqual([])
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('dedupes names shared across the requested types', async () => {
      vi.stubGlobal(
        'fetch',
        createFetchMock({
          [`${BASE_URL}type/electric`]: {
            body: { pokemon: [{ pokemon: { name: 'pikachu' } }] },
          },
          [`${BASE_URL}type/flying`]: {
            body: {
              pokemon: [
                { pokemon: { name: 'pikachu' } },
                { pokemon: { name: 'pidgey' } },
              ],
            },
          },
        }),
      )

      const result = await store
        .dispatch(pokeApi.endpoints.getPokemonByTypes.initiate(['electric', 'flying']))
        .unwrap()

      expect([...result].sort()).toEqual(['pidgey', 'pikachu'])
    })

    it('propagates an error when one of the underlying requests fails', async () => {
      vi.stubGlobal(
        'fetch',
        createFetchMock({
          [`${BASE_URL}type/bogus`]: { status: 404 },
        }),
      )

      await expect(
        store.dispatch(pokeApi.endpoints.getPokemonByTypes.initiate(['bogus'])).unwrap(),
      ).rejects.toBeDefined()
    })
  })

  describe('getPokemonByGenerations (plural)', () => {
    it('returns an empty array without calling fetch when there are no generations', async () => {
      const fetchMock = createFetchMock({})
      vi.stubGlobal('fetch', fetchMock)

      const result = await store
        .dispatch(pokeApi.endpoints.getPokemonByGenerations.initiate([]))
        .unwrap()

      expect(result).toEqual([])
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('dedupes names shared across the requested generations', async () => {
      vi.stubGlobal(
        'fetch',
        createFetchMock({
          [`${BASE_URL}generation/1`]: {
            body: { pokemon_species: [{ name: 'bulbasaur' }] },
          },
          [`${BASE_URL}generation/2`]: {
            body: { pokemon_species: [{ name: 'bulbasaur' }, { name: 'chikorita' }] },
          },
        }),
      )

      const result = await store
        .dispatch(pokeApi.endpoints.getPokemonByGenerations.initiate(['1', '2']))
        .unwrap()

      expect([...result].sort()).toEqual(['bulbasaur', 'chikorita'])
    })

    it('propagates an error when one of the underlying requests fails', async () => {
      vi.stubGlobal(
        'fetch',
        createFetchMock({
          [`${BASE_URL}generation/bogus`]: { status: 404 },
        }),
      )

      await expect(
        store
          .dispatch(pokeApi.endpoints.getPokemonByGenerations.initiate(['bogus']))
          .unwrap(),
      ).rejects.toBeDefined()
    })
  })

  it('getTypes returns the raw results list', async () => {
    vi.stubGlobal(
      'fetch',
      createFetchMock({
        [`${BASE_URL}type`]: {
          body: { results: [{ name: 'electric' }, { name: 'fire' }] },
        },
      }),
    )

    const result = await store.dispatch(pokeApi.endpoints.getTypes.initiate()).unwrap()

    expect(result).toEqual([{ name: 'electric' }, { name: 'fire' }])
  })

  it('getGenerations returns the raw results list', async () => {
    vi.stubGlobal(
      'fetch',
      createFetchMock({
        [`${BASE_URL}generation`]: { body: { results: [{ name: 'generation-i' }] } },
      }),
    )

    const result = await store
      .dispatch(pokeApi.endpoints.getGenerations.initiate())
      .unwrap()

    expect(result).toEqual([{ name: 'generation-i' }])
  })
})
