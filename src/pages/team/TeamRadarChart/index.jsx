import { useTheme } from 'styled-components'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip as RechartsTooltip,
} from 'recharts'
import { Skeleton } from '@/components/Skeleton'
import { FilterChip } from '@/components/FilterChip'
import { capitalize } from '@/utils/capitalize'
import { useTeamRadarChart } from './useTeamRadarChart'
import { ChartBox, Caption, Swatch, ChipsRow } from './TeamRadarChart.styles'

const getRadiusDomainMax = (max) => Math.max(120, Math.ceil(max / 10) * 10)

export const TeamRadarChart = () => {
  const theme = useTheme()
  const { chartData, series, visibleNames, handleToggle, isLoading } = useTeamRadarChart()

  if (isLoading) return <Skeleton $height="520px" />

  const visibleSeries = series.filter(({ name }) => visibleNames.includes(name))

  return (
    <>
      <ChartBox>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke={theme.color.border} />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: theme.color.textMuted, fontSize: 11 }}
            />
            <PolarRadiusAxis angle={90} domain={[0, getRadiusDomainMax]} tick={false} />
            {visibleSeries.map(({ name, color }) => (
              <Radar
                key={name}
                name={capitalize(name)}
                dataKey={name}
                stroke={color}
                fill={color}
                fillOpacity={0.2}
              />
            ))}
            <Radar
              name="Team Average"
              dataKey="average"
              stroke={theme.color.primary}
              fill={theme.color.primary}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <RechartsTooltip />
          </RadarChart>
        </ResponsiveContainer>
      </ChartBox>

      <Caption>
        <Swatch $color={theme.color.primary} />
        Team average
      </Caption>

      <ChipsRow>
        {series.map(({ name, color }) => (
          <FilterChip
            key={name}
            label={name}
            color={color}
            isActive={visibleNames.includes(name)}
            onClick={() => handleToggle(name)}
          />
        ))}
      </ChipsRow>
    </>
  )
}
