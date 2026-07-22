import { useTypeBadge } from './useTypeBadge'
import { Badge } from './TypeBadge.styles'

export const TypeBadge = ({ type }) => {
  const { color, label } = useTypeBadge({ type })

  return <Badge $color={color}>{label}</Badge>
}
