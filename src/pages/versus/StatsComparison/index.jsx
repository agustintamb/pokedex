import { useTheme } from 'styled-components'
import { MAX_STAT_VALUE } from '@/components/StatBar/useStatBar'
import {
  Wrapper,
  Caption,
  CaptionEntry,
  Swatch,
  List,
  Row,
  StatLabel,
  Track,
  Fill,
  Value,
} from './StatsComparison.styles'

const toPercentage = (value) => Math.min(100, (value / MAX_STAT_VALUE) * 100)

// Colores fijos (primary/accent), nameA/nameB para chart vacío con placeholders
export const StatsComparison = ({ statRows, nameA, nameB }) => {
  const theme = useTheme()
  const colorA = theme.color.primary
  const colorB = theme.color.accent

  return (
    <Wrapper>
      <Caption>
        <CaptionEntry>
          <Swatch $color={colorA} />
          {nameA}
        </CaptionEntry>
        <CaptionEntry>
          <Swatch $color={colorB} />
          {nameB}
        </CaptionEntry>
      </Caption>

      <List>
        {statRows.map((row) => (
          <Row key={row.stat}>
            <StatLabel>{row.label}</StatLabel>
            <Track>
              <Fill $percentage={toPercentage(row.valueA)} $color={colorA} />
              <Fill $percentage={toPercentage(row.valueB)} $color={colorB} />
            </Track>
            <Value $isWinner={row.winner === 'A'} data-winner={row.winner === 'A'}>
              {row.valueA}
            </Value>
            <Value $isWinner={row.winner === 'B'} data-winner={row.winner === 'B'}>
              {row.valueB}
            </Value>
          </Row>
        ))}
      </List>
    </Wrapper>
  )
}
