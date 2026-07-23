import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'

// Usado por Pokedex para el calc(100vh - ...)
export const NAVBAR_DESKTOP_HEIGHT = '100px'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(3)};
  max-width: 1264px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space(4)};
  background: ${({ theme }) => theme.color.background};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    height: ${NAVBAR_DESKTOP_HEIGHT};
    padding: 0 ${({ theme }) => theme.space(4)};
  }
`

export const Brand = styled(Link)`
  display: flex;
  align-items: center;
`

export const Logo = styled.img`
  height: 56px;
  width: auto;
  ${({ theme }) => theme.breakpoint.md} {
    height: 48px;
  }
`

export const NavList = styled.div`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.space(4)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: flex;
  }
`

export const NavItem = styled(NavLink)`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.onBackground};
  text-decoration: none;
  opacity: 0.85;
  padding-bottom: ${({ theme }) => theme.space(1)};
  border-bottom: 2px solid transparent;
  transition:
    opacity 0.15s ease,
    border-color 0.15s ease;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    font-size: 0.875rem;
  }

  &:hover {
    opacity: 1;
  }

  &.active {
    opacity: 1;
    border-bottom-color: ${({ theme }) => theme.color.onBackground};
  }
`

export const MenuToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: 2px solid ${({ theme }) => theme.color.onBackground};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.color.onBackground};
  font-size: 1.1rem;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: none;
  }
`

// Siempre montado para poder animar el opacity
export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 0.25s ease;
  z-index: 40;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: none;
  }
`

// Igual, siempre montado, desliza con transform
export const Drawer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(280px, 80vw);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
  padding: ${({ theme }) => theme.space(7)};
  background: ${({ theme }) => theme.color.background};
  box-shadow: ${({ theme }) => theme.shadow.modal};
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
  transition: transform 0.25s ease;
  z-index: 50;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: none;
  }
`
