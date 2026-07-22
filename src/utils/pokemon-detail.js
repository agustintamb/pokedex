export const normalizePokemonDetail = (response) => ({
  id: response.id,
  name: response.name,
  height: response.height,
  weight: response.weight,
  types: response.types.map(({ type }) => type.name),
  abilities: response.abilities.map(({ ability, is_hidden }) => ({
    name: ability.name,
    isHidden: is_hidden,
  })),
  stats: response.stats.map(({ base_stat, stat }) => ({
    name: stat.name,
    value: base_stat,
  })),
  sprites: {
    front: response.sprites.front_default,
    frontShiny: response.sprites.front_shiny,
    back: response.sprites.back_default,
    backShiny: response.sprites.back_shiny,
    artwork: response.sprites.other?.['official-artwork']?.front_default,
  },
})
