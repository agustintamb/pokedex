import { useMemo, useState } from 'react'
import { useFormik } from 'formik'
import { useGetPokemonIndexQuery, useGetPokemonDetailQuery } from '@/api/pokeApi'
import { STAT_ORDER, getStatLabel } from '@/utils/format-stats'
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

// query: lo tipeado en el input. otherValue: el pick ya confirmado en el OTRO slot.
const isDuplicateQuery = (query, otherValue) =>
  Boolean(query.trim()) && query.trim().toLowerCase() === otherValue

export const useVersusPage = () => {
  const { data: index = [] } = useGetPokemonIndexQuery()
  const validNames = useMemo(() => index.map((entry) => entry.name), [index])
  const schema = useMemo(() => buildVersusSchema(validNames), [validNames])

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

  // Otra selección visible pero deshabilitada (SearchSelect la bloquea), Yup valida tipeo manual
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

  // Duplicado en valores confirmados: bloquea canCompare, isDuplicateQuery maneja el error de input
  const isDuplicateSelection =
    Boolean(values.pokemonA) && values.pokemonA === values.pokemonB
  const canCompare = Boolean(detailA) && Boolean(detailB) && !isDuplicateSelection

  const isDuplicateQueryA = isDuplicateQuery(queryA, values.pokemonB)
  const isDuplicateQueryB = isDuplicateQuery(queryB, values.pokemonA)

  const displayNameA = detailA?.name ?? 'Pokemon 1'
  const displayNameB = detailB?.name ?? 'Pokemon 2'

  // 6 filas siempre (0 en lo que falte): chart ocupa espacio desde el arranque
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

  // Selecciona dos índices distintos sin retry
  const handleRandomize = () => {
    if (index.length < 2) return
    const firstIndex = Math.floor(Math.random() * index.length)
    let secondIndex = Math.floor(Math.random() * (index.length - 1))
    if (secondIndex >= firstIndex) secondIndex += 1
    handleSelectA(index[firstIndex].name)
    handleSelectB(index[secondIndex].name)
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
  }
}
