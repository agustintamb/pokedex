import { Wrapper, Bubble } from './Tooltip.styles'

export const Tooltip = ({ label, children }) => (
  <Wrapper>
    {children}
    <Bubble role="tooltip">{label}</Bubble>
  </Wrapper>
)
