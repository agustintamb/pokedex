import styled from 'styled-components'

export const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => theme.space(1)} ${({ theme }) => theme.space(3)};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surface};
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme.color.textMuted};
  white-space: nowrap;
`

export const Dot = styled.span`
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $online, theme }) =>
    $online ? theme.color.success : theme.color.danger};
`

export const Label = styled.span`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: inline;
  }
`

export const Hint = styled.span`
  display: none;
  font-weight: 400;
  color: ${({ theme }) => theme.color.textFaint};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: inline;
  }
`
