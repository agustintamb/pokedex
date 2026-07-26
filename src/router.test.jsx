import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, useParams } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'
import { AppRouter } from './router'

vi.mock('@/pages/pokedex', () => ({ PokedexPage: () => <div>pokedex-page</div> }))
vi.mock('@/pages/detail', () => ({
  DetailPage: () => {
    const { name } = useParams()
    return <div>detail-page:{name}</div>
  },
}))
vi.mock('@/pages/versus', () => ({ VersusPage: () => <div>versus-page</div> }))
vi.mock('@/pages/team', () => ({ TeamPage: () => <div>team-page</div> }))
vi.mock('@/pages/not-found', () => ({ NotFoundPage: () => <div>not-found-page</div> }))

// El ThemeProvider hace falta por el fallback de Suspense (usa styled-components), no por
// las páginas en sí, que acá van mockeadas.
const renderAt = (route) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[route]}>
        <AppRouter />
      </MemoryRouter>
    </ThemeProvider>,
  )

// Salvo la Home, las rutas van con lazy(): el import dinámico resuelve en un tick, así que
// se espera con findByText en vez de getByText.
describe('AppRouter', () => {
  it('renders the Pokedex page at /', () => {
    renderAt('/')
    expect(screen.getByText('pokedex-page')).toBeInTheDocument()
  })

  it('renders the Detail page with the :name param at /pokemon/:name', async () => {
    renderAt('/pokemon/pikachu')
    expect(await screen.findByText('detail-page:pikachu')).toBeInTheDocument()
  })

  it('renders the Team page at /team', async () => {
    renderAt('/team')
    expect(await screen.findByText('team-page')).toBeInTheDocument()
  })

  it('renders the Versus page at /versus', async () => {
    renderAt('/versus')
    expect(await screen.findByText('versus-page')).toBeInTheDocument()
  })

  it('renders the NotFound page at /404', async () => {
    renderAt('/404')
    expect(await screen.findByText('not-found-page')).toBeInTheDocument()
  })

  it('redirects any unknown path to /404', async () => {
    renderAt('/this-route-does-not-exist')
    expect(await screen.findByText('not-found-page')).toBeInTheDocument()
  })
})
