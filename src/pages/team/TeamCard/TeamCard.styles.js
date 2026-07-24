import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  width: 160px;
  padding: ${({ theme }) => theme.space(3)};
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    width: 200px;
  }
`

export const FavoriteSlot = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.space(2)};
  right: ${({ theme }) => theme.space(2)};
`

export const Stage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  background: ${({ theme }) => theme.color.surfaceMuted};
  border-radius: ${({ theme }) => theme.radius.full};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    width: 120px;
    height: 120px;
  }
`

export const Sprite = styled.img`
  width: ${({ $isStatic }) => ($isStatic ? '150px' : '80px')};
  height: ${({ $isStatic }) => ($isStatic ? '150px' : '80px')};
  object-fit: contain;
  image-rendering: pixelated;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    width: ${({ $isStatic }) => ($isStatic ? '150px' : '100px')};
    height: ${({ $isStatic }) => ($isStatic ? '150px' : '100px')};
  }
`

export const Name = styled(Link)`
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: capitalize;
  color: ${({ theme }) => theme.color.textPrimary};
  text-decoration: none;

  &:hover,
  &:focus-visible {
    text-decoration: underline;
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    font-size: 0.95rem;
  }
`
