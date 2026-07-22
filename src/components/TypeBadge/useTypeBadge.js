import { getTypeColor } from '@/utils/pokemon-types'

export const useTypeBadge = ({ type }) => ({
  color: getTypeColor(type),
  label: type,
})
