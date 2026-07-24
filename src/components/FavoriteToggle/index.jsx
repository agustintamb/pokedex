import { Pokeball } from '@/components/Pokeball'
import { Button } from './FavoriteToggle.styles'

export const FavoriteToggle = ({ isFavorite, onClick, name, size }) => {
  const handleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onClick()
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? `Remove ${name} from team` : `Add ${name} to team`}
    >
      <Pokeball isActive={isFavorite} size={size} />
    </Button>
  )
}
