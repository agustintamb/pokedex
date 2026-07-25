// Shiny primero (si existe), si no la oficial, si no el sprite de frente — usado por
// Detalle (con isShiny real) y Versus (siempre no-shiny, isShiny queda en false)
export const getArtworkSrc = (sprites, isShiny = false) => {
  if (isShiny && sprites.artworkShiny) return sprites.artworkShiny
  return sprites.artwork ?? sprites.front
}

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
    frontFemale: response.sprites.front_female,
    frontShinyFemale: response.sprites.front_shiny_female,
    back: response.sprites.back_default,
    backShiny: response.sprites.back_shiny,
    backFemale: response.sprites.back_female,
    backShinyFemale: response.sprites.back_shiny_female,
    artwork: response.sprites.other?.['official-artwork']?.front_default,
    artworkShiny: response.sprites.other?.['official-artwork']?.front_shiny,
  },
})
