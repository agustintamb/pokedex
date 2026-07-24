import styled, { keyframes, css } from 'styled-components'
import { NAVBAR_DESKTOP_HEIGHT } from '@/styles/page'

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
  // Responsive a propósito: en mobile sale pegado abajo (pedido explícito — más fácil de
  // alcanzar/descartar con el pulgar, estilo bottom-sheet); a partir de md vuelve arriba,
  // cerca del navbar, que es como se veía antes de este cambio. Sigue llamándose
  // "top-center" porque así se comporta en desktop (el nombre viene de ahí).
  'top-center': css`
    bottom: ${({ theme }) => theme.space(4)};
    left: 50%;
    transform: translateX(-50%);

    @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
      top: calc(${NAVBAR_DESKTOP_HEIGHT} + ${({ theme }) => theme.space(3)});
      bottom: auto;
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

// Una entrada por posición (no un solo booleano top/bottom): "top-center" necesita
// slideUp en mobile y slideDown desde md, ya que ahora es una sola posición que cambia de
// lado según el breakpoint (ver positionStyles) — un booleano fijo no alcanza para eso.
const entranceAnimations = {
  'top-left': css`
    animation: ${slideDown} 0.2s ease-out;
  `,
  'top-center': css`
    animation: ${slideUp} 0.2s ease-out;

    @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
      animation: ${slideDown} 0.2s ease-out;
    }
  `,
  'top-right': css`
    animation: ${slideDown} 0.2s ease-out;
  `,
  'bottom-left': css`
    animation: ${slideUp} 0.2s ease-out;
  `,
  'bottom-center': css`
    animation: ${slideUp} 0.2s ease-out;
  `,
  'bottom-right': css`
    animation: ${slideUp} 0.2s ease-out;
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
  ${({ $position }) => entranceAnimations[$position]}

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
