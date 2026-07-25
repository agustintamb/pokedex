import { Pokeball } from '@/components/Pokeball'
import { Rotator } from './Spinner.styles'

export const Spinner = ({ size = '20px' }) => (
  <Rotator aria-hidden="true">
    <Pokeball isActive size={size} />
  </Rotator>
)
