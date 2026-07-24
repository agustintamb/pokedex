import { useState } from 'react'
import pokedexLogo from '@/assets/pokedex-logo.png'
import {
  Nav,
  Brand,
  Logo,
  NavList,
  NavItem,
  MenuToggle,
  Backdrop,
  Drawer,
} from './Navbar.styles'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/team', label: 'Team' },
  { to: '/versus', label: 'Versus' },
]

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((current) => !current)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <Nav>
      <Brand to="/" onClick={closeMenu}>
        <Logo src={pokedexLogo} alt="Pokédex" />
      </Brand>

      <NavList>
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavItem key={to} to={to} end={end}>
            {label}
          </NavItem>
        ))}
      </NavList>

      <MenuToggle
        type="button"
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        ☰
      </MenuToggle>

      <Backdrop $isOpen={isMenuOpen} onClick={closeMenu} />

      <Drawer $isOpen={isMenuOpen} aria-hidden={!isMenuOpen}>
        {NAV_LINKS.map(({ to, label, end }) => (
          <NavItem key={to} to={to} end={end} onClick={closeMenu}>
            {label}
          </NavItem>
        ))}
      </Drawer>
    </Nav>
  )
}
