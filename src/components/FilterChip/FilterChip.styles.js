import styled from 'styled-components'

export const Chip = styled.button`
  padding: ${({ theme }) => theme.space(1)} ${({ theme }) => theme.space(2)};
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ $isActive, $color, theme }) =>
    $isActive ? ($color ?? theme.color.primary) : theme.color.surfaceMuted};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.color.onBackground : theme.color.textMuted};
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: capitalize;
  white-space: nowrap;
`
