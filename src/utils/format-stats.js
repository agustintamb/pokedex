const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
}

export const getStatLabel = (name) => STAT_LABELS[name] ?? name

export const formatHeight = (height) => `${(height / 10).toFixed(1)} m`

export const formatWeight = (weight) => `${(weight / 10).toFixed(1)} kg`
