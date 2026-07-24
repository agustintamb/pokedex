import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/render'
import { Navbar } from './index'

describe('Navbar', () => {
  it('renders the brand link to home', () => {
    renderWithProviders(<Navbar />)
    expect(screen.getByRole('img', { name: 'Pokédex' }).closest('a')).toHaveAttribute(
      'href',
      '/',
    )
  })

  // { hidden: true }: NavList se oculta bajo md por CSS y el Drawer con aria-hidden
  // mientras está cerrado — ambos siguen montados en el DOM, jsdom no simula el
  // viewport/media queries de forma confiable, así que no se testea cuál se ve
  it('renders both the desktop list and the mobile drawer with the same links', () => {
    renderWithProviders(<Navbar />)
    expect(screen.getAllByRole('link', { name: 'Team', hidden: true })).toHaveLength(2)
  })

  it('toggles aria-expanded on the menu button', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Navbar />)
    const toggle = screen.getByRole('button', { name: 'Toggle menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the drawer when one of its links is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Navbar />)
    const toggle = screen.getByRole('button', { name: 'Toggle menu' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    const [, drawerLink] = screen.getAllByRole('link', { name: 'Team', hidden: true })
    await user.click(drawerLink)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
