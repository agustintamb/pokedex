import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
  MAX_TEAM_SIZE,
  reorderFavorites,
  selectFavorites,
} from '@/store/slices/favorites.slice'
import { getTeamSlots } from '@/utils/team-slots'

export const useTeamPage = () => {
  const dispatch = useDispatch()
  const favorites = useSelector(selectFavorites)
  const isEmpty = favorites.length === 0
  const slots = getTeamSlots(favorites, MAX_TEAM_SIZE)
  const [isChartOpen, setIsChartOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const from = favorites.findIndex((entry) => entry.id === active.id)
    const to = favorites.findIndex((entry) => entry.id === over.id)
    if (from === -1 || to === -1) return
    dispatch(reorderFavorites({ from, to }))
  }

  const handleToggleChart = () => setIsChartOpen((current) => !current)

  return {
    favorites,
    isEmpty,
    slots,
    sensors,
    handleDragEnd,
    maxTeamSize: MAX_TEAM_SIZE,
    isChartOpen,
    handleToggleChart,
  }
}
