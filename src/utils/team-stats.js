import { STAT_ORDER, getStatLabel } from './format-stats'

export const getTeamRadarData = (detailsList) => {
  const details = detailsList.filter(Boolean)

  return STAT_ORDER.map((statName) => {
    const row = { stat: statName, label: getStatLabel(statName) }
    let total = 0

    details.forEach((detail) => {
      const value = detail.stats.find((stat) => stat.name === statName)?.value ?? 0
      row[detail.name] = value
      total += value
    })

    row.average = details.length ? Number((total / details.length).toFixed(1)) : 0
    return row
  })
}
