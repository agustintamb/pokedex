import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { parseListParam } from '@/utils/parse-list-param'
import {
  useGetPokemonByGenerationsQuery,
  useGetPokemonByTypesQuery,
  useGetPokemonIndexQuery,
} from '@/api/pokeApi'

const PAGE_SIZE = 24
const SEARCH_DEBOUNCE_MS = 300
const SUGGESTION_LIMIT = 8

// Recuerda página y scroll entre montajes (ej: ir al detalle y volver), para no perder el
// lugar cuando los filtros no cambiaron. Vive fuera del componente a propósito: no es
// estado de React, es memoria de la última vez que se desmontó la página.
const lastListState = { signature: '', page: 1, scrollTop: 0 }

export const usePokedexPage = () => {
  const { data: index = [], isLoading, isError, refetch } = useGetPokemonIndexQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const sentinelRef = useRef(null)
  const scrollContainerRef = useRef(null)

  const selectedTypes = parseListParam(searchParams.get('type')).sort()
  const selectedGenerations = parseListParam(searchParams.get('generation'))
    .map(Number)
    .sort((a, b) => a - b)

  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput)
  const [isSuggestionDismissed, setIsSuggestionDismissed] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(searchInput)
      setSearchParams(
        (params) => {
          const next = new URLSearchParams(params)
          if (searchInput) next.set('q', searchInput)
          else next.delete('q')
          return next
        },
        { replace: true },
      )
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const { data: typeMatches = [], isFetching: isFetchingTypes } =
    useGetPokemonByTypesQuery(selectedTypes, { skip: selectedTypes.length === 0 })
  const { data: generationMatches = [], isFetching: isFetchingGenerations } =
    useGetPokemonByGenerationsQuery(selectedGenerations, {
      skip: selectedGenerations.length === 0,
    })

  // Sin debounce: lista de texto liviana, a diferencia del grid no pesa re-renderizarla en cada tecla
  const suggestionQuery = searchInput.trim().toLowerCase()
  const suggestions =
    suggestionQuery && !isSuggestionDismissed
      ? index
          .filter((entry) => entry.name.includes(suggestionQuery))
          .slice(0, SUGGESTION_LIMIT)
          .map((entry) => entry.name)
      : []

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

  // Se sincroniza después de cada render (sin deps) para que el cleanup de abajo, que solo
  // corre al desmontar, lea siempre el último valor y no uno viejo de cuando se montó. Mutar
  // el ref durante el render (en vez de en un efecto) no es seguro con render concurrente.
  const listStateRef = useRef({ filterSignature, page })
  useEffect(() => {
    listStateRef.current = { filterSignature, page }
  })

  // Restaura el scroll una sola vez al montar; guarda página + scroll recién al desmontar
  // (no hace falta en cada scroll/cambio de página).
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

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const toggleFilters = () => setIsFiltersOpen((current) => !current)

  const handleRetry = () => refetch()

  const handleSearchChange = (value) => {
    setIsSuggestionDismissed(false)
    setSearchInput(value)
  }

  // Completa el input con el nombre elegido, no navega: sigue filtrando la grilla (mismo
  // substring match de siempre, así "pikachu" trae también "pikachu-gmax", etc.)
  const handleSelectSuggestion = (name) => {
    setIsSuggestionDismissed(true)
    setSearchInput(name)
  }

  const handleDismissSuggestions = () => setIsSuggestionDismissed(true)

  // Re-abre el listado si el usuario vuelve a enfocar el input sin haber tipeado nada
  // nuevo (ej: lo cerró clickeando afuera o eligiendo una sugerencia, y vuelve a tocarlo).
  const handleSearchFocus = () => setIsSuggestionDismissed(false)

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

  return {
    entries,
    isLoading,
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
    selectedTypes,
    handleToggleType,
    selectedGenerations,
    handleToggleGeneration,
    isFiltersOpen,
    toggleFilters,
  }
}
