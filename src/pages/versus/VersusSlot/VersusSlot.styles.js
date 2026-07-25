import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'

const float = keyframes`
  from { transform: scaleX(var(--flip, 1)) translateY(0); }
  to { transform: scaleX(var(--flip, 1)) translateY(-6px); }
`

export const Column = styled.div`
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  flex: 1;
  min-width: 0;
  max-width: 280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space(4)} ${({ theme }) => theme.space(2)};
`

// overflow:hidden recorta Skeleton durante carga
export const Stage = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surfaceMuted};
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    width: 180px;
    height: 180px;
  }
`

// Tamaño dinámico: 70% animado, 85% estático (fallback). $flip espeja el sprite (mira a
// la derecha en vez de a la izquierda, default)
export const Sprite = styled.img`
  position: relative;
  width: ${({ $isStatic }) => ($isStatic ? '85%' : '70%')};
  height: ${({ $isStatic }) => ($isStatic ? '85%' : '70%')};
  margin: ${({ $isStatic }) => ($isStatic ? '7.5%' : '15%')};
  object-fit: contain;
  image-rendering: pixelated;
  --flip: ${({ $flip }) => ($flip ? -1 : 1)};
  animation: ${float} 1.6s ease-in-out infinite alternate;
`

export const Name = styled(Link)`
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: capitalize;
  color: ${({ theme }) => theme.color.textPrimary};
  text-decoration: none;

  &:hover,
  &:focus-visible {
    text-decoration: underline;
  }
`
