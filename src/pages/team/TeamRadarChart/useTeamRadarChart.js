import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useGetPokemonDetailsQuery } from '@/api/pokeApi'
import { selectFavorites } from '@/store/slices/favorites.slice'
import { getTeamRadarData } from '@/utils/team-stats'
import { getTypeColor } from '@/utils/pokemon-types'

export const useTeamRadarChart = () => {
  const favorites = useSelector(selectFavorites)
  const names = favorites.map((entry) => entry.name)
  const { data: details, isLoading } = useGetPokemonDetailsQuery(names, {
    skip: names.length === 0,
  })
  const [visibleNames, setVisibleNames] = useState([])

  const chartData = useMemo(() => getTeamRadarData(details ?? []), [details])
  const series = useMemo(
    () =>
      (details ?? []).map((detail) => ({
        name: detail.name,
        color: getTypeColor(detail.types[0]),
      })),
    [details],
  )

  const handleToggle = (name) =>
    setVisibleNames((current) =>
      current.includes(name)
        ? current.filter((entry) => entry !== name)
        : [...current, name],
    )

  return { chartData, series, visibleNames, handleToggle, isLoading }
}
