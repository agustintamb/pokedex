import { Wrapper, Stage, Label } from './EmptySlot.styles'

// size/sizeMd/labelSize/padding: opcionales, con default = look actual de Team (grilla de
// hasta 6). Versus pasa su propio tamaño (igual al de su Stage con sprite) para que el
// placeholder ocupe exactamente el mismo espacio que el sprite una vez elegido — así el
// slot no "crece" al asignarse un Pokémon.
export const EmptySlot = ({ label = 'Empty slot', size, sizeMd, labelSize, padding }) => (
  <Wrapper $padding={padding}>
    <Stage $size={size} $sizeMd={sizeMd} />
    <Label $size={labelSize}>{label}</Label>
  </Wrapper>
)
