import { Wrapper, Stage, Label } from './EmptySlot.styles'

export const EmptySlot = ({ label = 'Empty slot', size, sizeMd, labelSize, padding }) => (
  <Wrapper $padding={padding}>
    <Stage $size={size} $sizeMd={sizeMd} />
    <Label $size={labelSize}>{label}</Label>
  </Wrapper>
)
