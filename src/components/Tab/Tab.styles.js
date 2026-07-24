import styled from 'styled-components'

export const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.space(1)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    justify-content: flex-start;
  }
`

export const TabButton = styled.button`
  padding: ${({ theme }) => theme.space(1)} ${({ theme }) => theme.space(2)};
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.color.primary : theme.color.surfaceMuted};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.color.onBackground : theme.color.textMuted};
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
`
