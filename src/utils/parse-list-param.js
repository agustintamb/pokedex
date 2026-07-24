export const parseListParam = (value) => value?.split(',').filter(Boolean) ?? []
