import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from './App'

// Router/Navbar/SnackbarViewport van como stand-ins: lo que se verifica es que App los
// monta a todos bajo los mismos providers, no su contenido (ya testeado por su cuenta).
vi.mock('@/router', () => ({ AppRouter: () => <div>app-router-stub</div> }))
vi.mock('@/components/Navbar', () => ({ Navbar: () => <nav>navbar-stub</nav> }))
vi.mock('@/components/Snackbar', () => ({
  SnackbarViewport: () => <div>snackbar-viewport-stub</div>,
}))

describe('App', () => {
  it('mounts the navbar, router and snackbar viewport under the real providers', async () => {
    render(<App />)

    expect(await screen.findByText('app-router-stub')).toBeInTheDocument()
    expect(screen.getByText('navbar-stub')).toBeInTheDocument()
    expect(screen.getByText('snackbar-viewport-stub')).toBeInTheDocument()
  })
})
