import { Wrapper, Bubble } from './Tooltip.styles'

export const Tooltip = ({ label, children, position = 'bottom' }) => (
  <Wrapper>
    {children}
    <Bubble role="tooltip" $position={position}>
      {label}
    </Bubble>
  </Wrapper>
)
