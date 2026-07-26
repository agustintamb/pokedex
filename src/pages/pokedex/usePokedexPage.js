import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from '@/hooks/useDebounce'
import { parseListParam } from '@/utils/parse-list-param'
import { getIsRetrying } from '@/utils/query-state'
import { POKEMON_TYPE_NAMES } from '@/utils/pokemon-types'
import { POKEMON_GENERATIONS } from '@/utils/generations'
import {
  useGetGenerationsQuery,
  useGetPokemonByGenerationsQuery,
  useGetPokemonByTypesQuery,
  useGetPokemonIndexQuery,
  useGetTypesQuery,
} from '@/api/pokeApi'

const PAGE_SIZE = 24
const SEARCH_DEBOUNCE_MS = 300
const SUGGESTION_LIMIT = 8

const lastListState = { signature: '', page: 1, scrollTop: 0 }

export const usePokedexPage = () => {
  const {
    data: index = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPokemonIndexQuery()
  const isRetrying = getIsRetrying({ isLoading, isFetching, hasData: index.length > 0 })
  const handleRetry = () => refetch()

  const [searchParams, setSearchParams] = useSearchParams()
  const sentinelRef = useRef(null)
  const scrollContainerRef = useRef(null)

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const toggleFilters = () => setIsFiltersOpen((current) => !current)

  // --- Filtros por tipo/generación (persistidos en la URL) ---
  const { data: pokemonTypes = POKEMON_TYPE_NAMES } = useGetTypesQuery()
  const { data: pokemonGenerations = POKEMON_GENERATIONS } = useGetGenerationsQuery()

  const selectedTypes = parseListParam(searchParams.get('type')).sort()
  const selectedGenerations = parseListParam(searchParams.get('generation'))
    .map(Number)
    .sort((a, b) => a - b)

  const { data: typeMatches = [], isFetching: isFetchingTypes } =
    useGetPokemonByTypesQuery(selectedTypes, { skip: selectedTypes.length === 0 })
  const { data: generationMatches = [], isFetching: isFetchingGenerations } =
    useGetPokemonByGenerationsQuery(selectedGenerations, {
      skip: selectedGenerations.length === 0,
    })

  const toggleListParam = (key, value) => {
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params)
        const current = parseListParam(next.get(key))
        const updated = current.includes(value)
          ? current.filter((entry) => entry !== value)
          : [...current, value]
        if (updated.length) next.set(key, updated.join(','))
        else next.delete(key)
        return next
      },
      { replace: true },
    )
  }

  const handleToggleType = (type) => toggleListParam('type', type)
  const handleToggleGeneration = (generation) =>
    toggleListParam('generation', String(generation))

  // --- Búsqueda por nombre y sugerencias ---
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const [isSuggestionDismissed, setIsSuggestionDismissed] = useState(false)
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params)
        if (debouncedSearch) next.set('q', debouncedSearch)
        else next.delete('q')
        return next
      },
      { replace: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  const suggestionQuery = searchInput.trim().toLowerCase()
  const suggestions =
    suggestionQuery && !isSuggestionDismissed
      ? index
          .filter((entry) => entry.name.includes(suggestionQuery))
          .slice(0, SUGGESTION_LIMIT)
          .map((entry) => entry.name)
      : []

  const handleSearchChange = (value) => {
    setIsSuggestionDismissed(false)
    setSearchInput(value)
  }

  const handleSelectSuggestion = (name) => {
    setIsSuggestionDismissed(true)
    setSearchInput(name)
  }

  const handleDismissSuggestions = () => setIsSuggestionDismissed(true)

  const handleSearchFocus = () => setIsSuggestionDismissed(false)

  // --- Filtrado combinado, paginación e infinite scroll ---
  let filteredIndex = index

  if (debouncedSearch) {
    const query = debouncedSearch.toLowerCase()
    filteredIndex = filteredIndex.filter((entry) => entry.name.includes(query))
  }
  if (selectedTypes.length) {
    const typeSet = new Set(typeMatches)
    filteredIndex = filteredIndex.filter((entry) => typeSet.has(entry.name))
  }
  if (selectedGenerations.length) {
    const generationSet = new Set(generationMatches)
    filteredIndex = filteredIndex.filter((entry) => generationSet.has(entry.name))
  }

  const filterSignature = JSON.stringify([
    debouncedSearch,
    selectedTypes,
    selectedGenerations,
  ])
  const [trackedSignature, setTrackedSignature] = useState(filterSignature)
  const [page, setPage] = useState(() =>
    lastListState.signature === filterSignature ? lastListState.page : 1,
  )

  // Reset de página en render, no en efecto (mismo patrón que useDetailPage)
  if (filterSignature !== trackedSignature) {
    setTrackedSignature(filterSignature)
    setPage(1)
  }

  const entries = filteredIndex.slice(0, page * PAGE_SIZE)
  const hasMore = entries.length < filteredIndex.length
  const isFiltersLoading = isFetchingTypes || isFetchingGenerations
  const isEmpty = !isLoading && !isFiltersLoading && filteredIndex.length === 0

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPage((current) => current + 1)
      },
      { root: scrollContainerRef.current, rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore])

  // Sin deps: el cleanup de abajo corre solo al desmontar y necesita el último valor, no el
  // del montaje (mutar el ref durante el render no es seguro con render concurrente)
  const listStateRef = useRef({ filterSignature, page })
  useEffect(() => {
    listStateRef.current = { filterSignature, page }
  })

  useLayoutEffect(() => {
    const container = scrollContainerRef.current
    if (container && lastListState.signature === filterSignature)
      container.scrollTop = lastListState.scrollTop
    return () => {
      lastListState.signature = listStateRef.current.filterSignature
      lastListState.page = listStateRef.current.page
      if (container) lastListState.scrollTop = container.scrollTop
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    entries,
    isLoading,
    isRetrying,
    isFiltersLoading,
    isError,
    isEmpty,
    hasMore,
    sentinelRef,
    scrollContainerRef,
    handleRetry,
    searchInput,
    handleSearchChange,
    suggestions,
    handleSelectSuggestion,
    handleDismissSuggestions,
    handleSearchFocus,
    pokemonTypes,
    selectedTypes,
    handleToggleType,
    pokemonGenerations,
    selectedGenerations,
    handleToggleGeneration,
    isFiltersOpen,
    toggleFilters,
  }
}
