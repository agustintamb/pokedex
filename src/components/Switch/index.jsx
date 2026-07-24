import { Track, Thumb } from './Switch.styles'

export const Switch = ({ isOn, onClick, ariaLabel }) => (
  <Track
    type="button"
    role="switch"
    aria-checked={isOn}
    aria-label={ariaLabel}
    $isOn={isOn}
    onClick={onClick}
  >
    <Thumb $isOn={isOn} />
  </Track>
)
