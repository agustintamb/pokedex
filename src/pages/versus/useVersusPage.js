import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFormik } from 'formik'
import { useGetPokemonIndexQuery, useGetPokemonDetailQuery } from '@/api/pokeApi'
import { STAT_ORDER, getStatLabel } from '@/utils/format-stats'
import { getIsRetrying } from '@/utils/query-state'
import { buildVersusSchema } from './versus.schema'

const SUGGESTION_LIMIT = 8
const DUPLICATE_ERROR_MESSAGE = 'You have already picked this Pokémon'

const buildSuggestions = (index, query, isDismissed) => {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed || isDismissed) return []
  return index
    .filter((entry) => entry.name.includes(trimmed))
    .slice(0, SUGGESTION_LIMIT)
    .map((entry) => entry.name)
}

const getStatValue = (detail, statName) =>
  detail?.stats.find((stat) => stat.name === statName)?.value ?? 0

const isDuplicateQuery = (query, otherValue) =>
  Boolean(query.trim()) && query.trim().toLowerCase() === otherValue

export const useVersusPage = () => {
  const {
    data: index = [],
    isError: isIndexError,
    isLoading: isIndexLoading,
    isFetching: isIndexFetching,
    refetch: refetchIndex,
  } = useGetPokemonIndexQuery()
  const isRetryingIndex = getIsRetrying({
    isLoading: isIndexLoading,
    isFetching: isIndexFetching,
    hasData: index.length > 0,
  })
  const validNames = useMemo(() => index.map((entry) => entry.name), [index])
  const schema = useMemo(() => buildVersusSchema(validNames), [validNames])

  const [searchParams, setSearchParams] = useSearchParams()

  const { values, setFieldValue } = useFormik({
    initialValues: { pokemonA: '', pokemonB: '' },
    validationSchema: schema,
  })

  // Query: texto tipeado. Values: pick confirmado (solo lista/random lo confirman)
  const [queryA, setQueryA] = useState('')
  const [queryB, setQueryB] = useState('')
  const [isDismissedA, setIsDismissedA] = useState(false)
  const [isDismissedB, setIsDismissedB] = useState(false)

  const handleQueryChangeA = (text) => {
    setIsDismissedA(false)
    setQueryA(text)
    setFieldValue('pokemonA', '')
  }

  const handleQueryChangeB = (text) => {
    setIsDismissedB(false)
    setQueryB(text)
    setFieldValue('pokemonB', '')
  }

  const handleSelectA = (name) => {
    setIsDismissedA(true)
    setQueryA(name)
    setFieldValue('pokemonA', name)
  }

  const handleSelectB = (name) => {
    setIsDismissedB(true)
    setQueryB(name)
    setFieldValue('pokemonB', name)
  }

  const [hasHydratedFromUrl, setHasHydratedFromUrl] = useState(false)

  // Hidrata una sola vez, recién con el índice cargado (hace falta para validar los nombres)
  if (!hasHydratedFromUrl && validNames.length > 0) {
    setHasHydratedFromUrl(true)
    const urlA = searchParams.get('a')?.toLowerCase()
    const urlB = searchParams.get('b')?.toLowerCase()
    if (urlA && validNames.includes(urlA)) handleSelectA(urlA)
    if (urlB && urlB !== urlA && validNames.includes(urlB)) handleSelectB(urlB)
  }

  useEffect(() => {
    if (!hasHydratedFromUrl) return
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params)
        if (values.pokemonA) next.set('a', values.pokemonA)
        else next.delete('a')
        if (values.pokemonB) next.set('b', values.pokemonB)
        else next.delete('b')
        return next
      },
      { replace: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.pokemonA, values.pokemonB])

  const suggestionsA = buildSuggestions(index, queryA, isDismissedA)
  const suggestionsB = buildSuggestions(index, queryB, isDismissedB)

  const { data: detailA, isLoading: isLoadingA } = useGetPokemonDetailQuery(
    values.pokemonA,
    {
      skip: !values.pokemonA,
    },
  )
  const { data: detailB, isLoading: isLoadingB } = useGetPokemonDetailQuery(
    values.pokemonB,
    {
      skip: !values.pokemonB,
    },
  )

  const isDuplicateSelection =
    Boolean(values.pokemonA) && values.pokemonA === values.pokemonB
  const canCompare = Boolean(detailA) && Boolean(detailB) && !isDuplicateSelection

  const isDuplicateQueryA = isDuplicateQuery(queryA, values.pokemonB)
  const isDuplicateQueryB = isDuplicateQuery(queryB, values.pokemonA)

  const displayNameA = detailA?.name ?? 'Pokemon 1'
  const displayNameB = detailB?.name ?? 'Pokemon 2'

  const statRows = useMemo(
    () =>
      STAT_ORDER.map((statName) => {
        const valueA = getStatValue(detailA, statName)
        const valueB = getStatValue(detailB, statName)
        const getWinner = () => {
          if (!canCompare || valueA === valueB) return null
          return valueA > valueB ? 'A' : 'B'
        }
        const winner = getWinner()
        return { stat: statName, label: getStatLabel(statName), valueA, valueB, winner }
      }),
    [canCompare, detailA, detailB],
  )

  // El segundo se sortea entre uno menos y se corre uno si pisa al primero: dos distintos
  const pickRandomPair = (list) => {
    const firstIndex = Math.floor(Math.random() * list.length)
    let secondIndex = Math.floor(Math.random() * (list.length - 1))
    if (secondIndex >= firstIndex) secondIndex += 1
    handleSelectA(list[firstIndex].name)
    handleSelectB(list[secondIndex].name)
  }

  const [isRandomizing, setIsRandomizing] = useState(false)

  const handleRandomize = () => {
    if (index.length >= 2) {
      pickRandomPair(index)
      return
    }
    setIsRandomizing(true)
    refetchIndex()
      .unwrap()
      .then((freshIndex) => {
        if (freshIndex.length >= 2) pickRandomPair(freshIndex)
      })
      .catch(() => {})
      .finally(() => setIsRandomizing(false))
  }

  return {
    slotA: {
      query: queryA,
      suggestions: suggestionsA,
      disabledOptions: [values.pokemonB],
      detail: detailA,
      isLoading: isLoadingA,
      isError: isDuplicateQueryA,
      errorMessage: isDuplicateQueryA ? DUPLICATE_ERROR_MESSAGE : undefined,
      onQueryChange: handleQueryChangeA,
      onSelectOption: handleSelectA,
      onDismiss: () => setIsDismissedA(true),
      onFocus: () => setIsDismissedA(false),
    },
    slotB: {
      query: queryB,
      suggestions: suggestionsB,
      disabledOptions: [values.pokemonA],
      detail: detailB,
      isLoading: isLoadingB,
      isError: isDuplicateQueryB,
      errorMessage: isDuplicateQueryB ? DUPLICATE_ERROR_MESSAGE : undefined,
      onQueryChange: handleQueryChangeB,
      onSelectOption: handleSelectB,
      onDismiss: () => setIsDismissedB(true),
      onFocus: () => setIsDismissedB(false),
    },
    canCompare,
    displayNameA,
    displayNameB,
    statRows,
    onRandomize: handleRandomize,
    isRandomizing,
    isLoading: isIndexLoading,
    isRetrying: isRetryingIndex,
    isError: isIndexError,
    onRetry: refetchIndex,
  }
}
