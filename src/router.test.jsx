import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, useParams } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
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

const renderAt = (route) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <AppRouter />
    </MemoryRouter>,
  )

describe('AppRouter', () => {
  it('renders the Pokedex page at /', () => {
    renderAt('/')
    expect(screen.getByText('pokedex-page')).toBeInTheDocument()
  })

  it('renders the Detail page with the :name param at /pokemon/:name', () => {
    renderAt('/pokemon/pikachu')
    expect(screen.getByText('detail-page:pikachu')).toBeInTheDocument()
  })

  it('renders the Team page at /team', () => {
    renderAt('/team')
    expect(screen.getByText('team-page')).toBeInTheDocument()
  })

  it('renders the Versus page at /versus', () => {
    renderAt('/versus')
    expect(screen.getByText('versus-page')).toBeInTheDocument()
  })

  it('renders the NotFound page at /404', () => {
    renderAt('/404')
    expect(screen.getByText('not-found-page')).toBeInTheDocument()
  })

  it('redirects any unknown path to /404', () => {
    renderAt('/this-route-does-not-exist')
    expect(screen.getByText('not-found-page')).toBeInTheDocument()
  })
})
