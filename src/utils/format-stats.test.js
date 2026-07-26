import { describe, it, expect } from 'vitest'
import {
  getStatLabel,
  formatDexNumber,
  formatHeight,
  formatWeight,
  STAT_ORDER,
} from './format-stats'

describe('STAT_ORDER', () => {
  it('lists the six base stats in the canonical PokeAPI order', () => {
    expect(STAT_ORDER).toEqual([
      'hp',
      'attack',
      'defense',
      'special-attack',
      'special-defense',
      'speed',
    ])
  })
})

describe('getStatLabel', () => {
  it.each([
    ['hp', 'HP'],
    ['attack', 'Attack'],
    ['defense', 'Defense'],
    ['special-attack', 'Sp. Atk'],
    ['special-defense', 'Sp. Def'],
    ['speed', 'Speed'],
  ])('maps %s to %s', (name, label) => expect(getStatLabel(name)).toBe(label))

  it('falls back to the raw name for an unknown stat', () => {
    expect(getStatLabel('accuracy')).toBe('accuracy')
  })
})

describe('formatDexNumber', () => {
  it('pads the id to three digits', () => {
    expect(formatDexNumber(1)).toBe('N.º 001')
    expect(formatDexNumber(25)).toBe('N.º 025')
    expect(formatDexNumber(133)).toBe('N.º 133')
  })

  it('leaves ids beyond three digits untouched', () => {
    expect(formatDexNumber(1025)).toBe('N.º 1025')
  })
})

describe('formatHeight', () => {
  it('converts decimetres to metres with one decimal', () => {
    expect(formatHeight(7)).toBe('0.7 m')
    expect(formatHeight(10)).toBe('1.0 m')
    expect(formatHeight(123)).toBe('12.3 m')
  })

  it('handles zero', () => {
    expect(formatHeight(0)).toBe('0.0 m')
  })
})

describe('formatWeight', () => {
  it('converts hectograms to kilograms with one decimal', () => {
    expect(formatWeight(69)).toBe('6.9 kg')
    expect(formatWeight(100)).toBe('10.0 kg')
  })

  it('handles zero', () => {
    expect(formatWeight(0)).toBe('0.0 kg')
  })
})
