export const getTeamSlots = (favorites, size) =>
  Array.from({ length: size }, (_, index) => favorites[index] ?? null)
