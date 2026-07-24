import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { showSnackbar } from '@/store/slices/ui.slice'
import {
  MAX_TEAM_SIZE,
  addFavorite,
  removeFavorite,
  selectFavoritesCount,
  selectIsFavorite,
} from '@/store/slices/favorites.slice'

export const useFavoriteToggle = ({ id, name }) => {
  const dispatch = useDispatch()
  const isFavorite = useSelector((state) => selectIsFavorite(state, id))
  const favoritesCount = useSelector(selectFavoritesCount)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleToggleClick = () => {
    if (!isFavorite && favoritesCount >= MAX_TEAM_SIZE) {
      dispatch(
        showSnackbar({
          variant: 'error',
          message: `Your team is full. Remove one before adding another.`,
        }),
      )
      return
    }
    setIsModalOpen(true)
  }

  const handleCancel = () => setIsModalOpen(false)

  const handleConfirm = () => {
    if (isFavorite) {
      dispatch(removeFavorite(id))
      dispatch(
        showSnackbar({ variant: 'info', message: `${name} was removed from your team.` }),
      )
    } else {
      dispatch(addFavorite({ id, name }))
      dispatch(
        showSnackbar({ variant: 'success', message: `${name} was added to your team!` }),
      )
    }
    setIsModalOpen(false)
  }

  const modalMessage = isFavorite
    ? `Remove ${name} from your team?`
    : `Add ${name} to your team?`

  return {
    isFavorite,
    isModalOpen,
    modalMessage,
    handleToggleClick,
    handleConfirm,
    handleCancel,
  }
}
