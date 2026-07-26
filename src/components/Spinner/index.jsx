import { Pokeball } from '@/components/Pokeball'
import { Rotator } from './Spinner.styles'

export const Spinner = ({ size = '20px', label }) => (
  <Rotator
    role={label ? 'status' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : 'true'}
  >
    <Pokeball isActive size={size} />
  </Rotator>
)
