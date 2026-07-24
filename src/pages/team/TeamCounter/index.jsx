import { Count } from './TeamCounter.styles'

export const TeamCounter = ({ count, max }) => (
  <Count>
    {count}/{max}
  </Count>
)
