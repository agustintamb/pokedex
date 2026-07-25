import styled from 'styled-components'

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: scale(1.1);
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    width: 96px;
    height: 96px;
  }
`
