import { describe, it, expect } from 'vitest'
import { getTeamRadarData } from './team-stats'
import { STAT_ORDER } from './format-stats'

const buildDetail = (name, values) => ({
  name,
  stats: STAT_ORDER.map((statName, index) => ({ name: statName, value: values[index] })),
})

describe('getTeamRadarData', () => {
  it('returns the six stats in canonical order', () => {
    const result = getTeamRadarData([buildDetail('pikachu', [1, 2, 3, 4, 5, 6])])
    expect(result.map((entry) => entry.stat)).toEqual(STAT_ORDER)
  })

  it('includes a per-Pokémon value alongside the average', () => {
    const result = getTeamRadarData([
      buildDetail('pikachu', [35, 55, 40, 50, 50, 90]),
      buildDetail('charmander', [39, 52, 43, 60, 50, 65]),
    ])
    const hpEntry = result.find((entry) => entry.stat === 'hp')
    expect(hpEntry.pikachu).toBe(35)
    expect(hpEntry.charmander).toBe(39)
    expect(hpEntry.average).toBe(37)
  })

  it('averages a single Pokémon to its own stats', () => {
    const result = getTeamRadarData([buildDetail('pikachu', [35, 55, 40, 50, 50, 90])])
    expect(result.map((entry) => entry.average)).toEqual([35, 55, 40, 50, 50, 90])
  })

  it('defaults a stat missing from an entry to 0 for that entry and the average', () => {
    const missingHp = {
      name: 'ditto',
      stats: STAT_ORDER.filter((name) => name !== 'hp').map((name) => ({
        name,
        value: 40,
      })),
    }
    const result = getTeamRadarData([
      missingHp,
      buildDetail('snorlax', [80, 40, 40, 40, 40, 40]),
    ])
    const hpEntry = result.find((entry) => entry.stat === 'hp')
    expect(hpEntry.ditto).toBe(0)
    expect(hpEntry.average).toBe(40)
  })

  it('ignores falsy (still-loading) entries', () => {
    const result = getTeamRadarData([
      undefined,
      buildDetail('snorlax', [50, 50, 50, 50, 50, 50]),
      null,
    ])
    expect(result.every((entry) => entry.average === 50)).toBe(true)
  })

  it('returns all zeros and no per-Pokémon keys for an empty list', () => {
    const result = getTeamRadarData([])
    expect(result.every((entry) => entry.average === 0)).toBe(true)
    expect(Object.keys(result[0])).toEqual(['stat', 'label', 'average'])
  })

  it('includes a display label per stat', () => {
    const result = getTeamRadarData([buildDetail('pikachu', [1, 2, 3, 4, 5, 6])])
    expect(result.find((entry) => entry.stat === 'special-attack').label).toBe('Sp. Atk')
  })
})
