import { Chip } from './FilterChip.styles'

export const FilterChip = ({ label, isActive, color, onClick }) => (
  <Chip type="button" $isActive={isActive} $color={color} onClick={onClick}>
    {label}
  </Chip>
)
