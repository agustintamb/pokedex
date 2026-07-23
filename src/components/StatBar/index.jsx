import { useStatBar } from './useStatBar'
import { Row, Label, Track, Fill, Value } from './StatBar.styles'

export const StatBar = ({ label, value }) => {
  const { percentage } = useStatBar({ value })

  return (
    <Row>
      <Label>{label}</Label>
      <Track>
        <Fill $percentage={percentage} />
      </Track>
      <Value>{value}</Value>
    </Row>
  )
}
