import styled from 'styled-components'

export const Ball = styled.span`
  position: relative;
  display: block;
  font-size: ${({ $size }) => $size ?? '28px'};
  width: 1em;
  height: 1em;
  border: 0.0715em solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surface};
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: 50%;
    background: ${({ $isActive, theme }) =>
      $isActive ? theme.color.primary : theme.color.textFaint};
    border-bottom: 0.0715em solid ${({ theme }) => theme.color.border};
    transition: background 0.15s ease;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    width: 0.286em;
    height: 0.286em;
    transform: translate(-50%, -50%);
    background: ${({ theme }) => theme.color.surface};
    border: 0.0715em solid ${({ theme }) => theme.color.border};
    border-radius: 50%;
  }
`
