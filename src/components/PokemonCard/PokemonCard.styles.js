import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => theme.space(3)};
  background: ${({ theme }) => theme.color.surface};
  border: 2px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.card};
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.cardHover};
  }
`

export const SpriteWrapper = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  background: ${({ theme }) => theme.color.surfaceMuted};
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
`

export const Sprite = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
  opacity: ${({ $isLoaded }) => ($isLoaded ? 1 : 0)};
  transition: opacity 0.2s ease;
`

export const Number = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  color: ${({ theme }) => theme.color.textFaint};
  font-size: 0.75rem;
`

export const Name = styled.h2`
  font-size: 1rem;
  font-weight: 500;
  text-transform: capitalize;
  color: ${({ theme }) => theme.color.textPrimary};
`

export const Badges = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space(1)};
  flex-wrap: wrap;
`
