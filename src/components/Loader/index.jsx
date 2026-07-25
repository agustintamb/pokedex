import { Spinner } from '@/components/Spinner'
import { Wrapper } from './Loader.styles'

export const Loader = ({ size = '44px', label = 'Loading', fill = false }) => (
  <Wrapper role="status" aria-label={label} $fill={fill}>
    <Spinner size={size} />
  </Wrapper>
)
