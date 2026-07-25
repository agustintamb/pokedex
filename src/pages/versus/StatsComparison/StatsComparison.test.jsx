import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/render'
import { StatsComparison } from './index'

const statRows = [
  { stat: 'hp', label: 'HP', valueA: 35, valueB: 60, winner: 'B' },
  { stat: 'attack', label: 'Attack', valueA: 55, valueB: 52, winner: 'A' },
  { stat: 'defense', label: 'Defense', valueA: 40, valueB: 40, winner: null },
]

describe('StatsComparison', () => {
  it('renders a row per stat with both values and the header names', () => {
    render(<StatsComparison statRows={statRows} nameA="pikachu" nameB="raichu" />)

    expect(screen.getByText('HP')).toBeInTheDocument()
    expect(screen.getByText('Attack')).toBeInTheDocument()
    expect(screen.getByText('Defense')).toBeInTheDocument()
    expect(screen.getByText('pikachu')).toBeInTheDocument()
    expect(screen.getByText('raichu')).toBeInTheDocument()
  })

  it('marks the higher value as the winner for each stat', () => {
    render(<StatsComparison statRows={statRows} nameA="pikachu" nameB="raichu" />)

    expect(screen.getByText('60')).toHaveAttribute('data-winner', 'true')
    expect(screen.getByText('35')).toHaveAttribute('data-winner', 'false')
    expect(screen.getByText('55')).toHaveAttribute('data-winner', 'true')
    expect(screen.getByText('52')).toHaveAttribute('data-winner', 'false')
  })

  it('marks neither value as the winner on a tie', () => {
    render(<StatsComparison statRows={statRows} nameA="pikachu" nameB="raichu" />)

    const tiedValues = screen.getAllByText('40')
    tiedValues.forEach((value) => expect(value).toHaveAttribute('data-winner', 'false'))
  })
})
