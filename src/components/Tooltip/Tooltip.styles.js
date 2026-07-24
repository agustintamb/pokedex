import styled, { css } from 'styled-components'

const positions = {
  // Debajo del trigger (default) — para triggers cerca del borde superior de su contenedor
  bottom: css`
    top: calc(100% + ${({ theme }) => theme.space(2)});

    &::after {
      bottom: 100%;
      border-bottom-color: ${({ theme }) => theme.color.border};
    }
  `,
  top: css`
    bottom: calc(100% + ${({ theme }) => theme.space(2)});

    &::after {
      top: 100%;
      border-top-color: ${({ theme }) => theme.color.border};
    }
  `,
}

export const Bubble = styled.span`
  position: absolute;
  left: 50%;
  z-index: 30;
  transform: translateX(-50%);
  padding: ${({ theme }) => theme.space(1)} ${({ theme }) => theme.space(2)};
  background: ${({ theme }) => theme.color.border};
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.radius.sm};
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease;
  pointer-events: none;
  ${({ $position }) => positions[$position]}

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
  }
`

export const Wrapper = styled.span`
  position: relative;
  display: inline-flex;

  &:hover ${Bubble}, &:focus-within ${Bubble} {
    opacity: 1;
    visibility: visible;
  }
`
