import styled, { keyframes, css } from 'styled-components'
import {
  NAVBAR_MOBILE_HEIGHT,
  NAVBAR_DESKTOP_HEIGHT,
} from '@/components/Navbar/Navbar.styles'

// Sin translateX acá: el centrado horizontal ya lo hace Viewport (left:50% + su propio
// translateX). Sumarlo también acá lo corría de más durante la animación — se veía
// descentrado mientras animaba y recién se centraba bien al terminar (cuando el
// transform de la animación se apaga y queda el de Viewport solo).
const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
`

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`

const variantBackground = {
  info: ({ theme }) => theme.color.accent,
  success: ({ theme }) => theme.color.success,
  error: ({ theme }) => theme.color.danger,
}

const positionStyles = {
  'top-left': css`
    top: ${({ theme }) => theme.space(5)};
    left: ${({ theme }) => theme.space(5)};
  `,
  // top: espacio + alto del navbar (sticky en mobile), para no aparecer tapado por él
  'top-center': css`
    top: calc(${NAVBAR_MOBILE_HEIGHT} + ${({ theme }) => theme.space(3)});
    left: 50%;
    transform: translateX(-50%);

    @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
      top: calc(${NAVBAR_DESKTOP_HEIGHT} + ${({ theme }) => theme.space(3)});
    }
  `,
  'top-right': css`
    top: ${({ theme }) => theme.space(5)};
    right: ${({ theme }) => theme.space(5)};
  `,
  'bottom-left': css`
    bottom: ${({ theme }) => theme.space(5)};
    left: ${({ theme }) => theme.space(5)};
  `,
  'bottom-center': css`
    bottom: ${({ theme }) => theme.space(5)};
    left: 50%;
    transform: translateX(-50%);
  `,
  'bottom-right': css`
    bottom: ${({ theme }) => theme.space(5)};
    right: ${({ theme }) => theme.space(5)};
  `,
}

export const Viewport = styled.div`
  position: fixed;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
  ${({ $position }) => positionStyles[$position]}
`

export const SnackbarCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  min-width: 280px;
  max-width: 420px;
  padding: ${({ theme }) => theme.space(3)} ${({ theme }) => theme.space(4)};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${(props) => variantBackground[props.$variant](props)};
  color: #fff;
  box-shadow: ${({ theme }) => theme.shadow.modal};
  animation: ${({ $isTop }) => ($isTop ? slideDown : slideUp)} 0.2s ease-out;

  @media (max-width: 600px) {
    min-width: auto;
    width: calc(100vw - 40px);
    max-width: calc(100vw - 40px);
  }
`

export const SnackbarText = styled.p`
  font-size: 0.85rem;
  font-weight: 500;
  flex: 1;
  line-height: 1.4;
`

export const SnackbarDismiss = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  line-height: 1;
  padding: 0;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;

  &:hover {
    color: #fff;
  }
`
