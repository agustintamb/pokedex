import { describe, it, expect } from 'vitest'
import {
  getIdFromUrl,
  getSpriteUrl,
  getArtworkUrl,
  getAnimatedSpriteUrl,
} from './pokemon-url'

describe('getIdFromUrl', () => {
  it('extracts the trailing id from a PokeAPI url', () => {
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
  })

  it('handles urls without a trailing slash', () => {
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/25')).toBe(25)
  })

  it('returns null for a falsy url', () => {
    expect(getIdFromUrl(null)).toBeNull()
    expect(getIdFromUrl(undefined)).toBeNull()
    expect(getIdFromUrl('')).toBeNull()
  })
})

describe('getSpriteUrl', () => {
  it('builds the sprite url for an id', () => {
    expect(getSpriteUrl(25)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    )
  })

  it('returns null without an id', () => {
    expect(getSpriteUrl(null)).toBeNull()
  })
})

describe('getArtworkUrl', () => {
  it('builds the official-artwork url for an id', () => {
    expect(getArtworkUrl(25)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    )
  })

  it('returns null without an id', () => {
    expect(getArtworkUrl(null)).toBeNull()
  })
})

describe('getAnimatedSpriteUrl', () => {
  it('builds the black-white animated url for an id', () => {
    expect(getAnimatedSpriteUrl(25)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif',
    )
  })

  it('returns null without an id', () => {
    expect(getAnimatedSpriteUrl(null)).toBeNull()
  })
})
