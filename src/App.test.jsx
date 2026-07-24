import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { App } from './App'

// App.jsx monta el árbol completo (Provider real + PersistGate + BrowserRouter + Navbar +
// AppRouter + SnackbarViewport). Router/Navbar/SnackbarViewport ya están testeados por su
// cuenta (router.test.jsx, Navbar.test.jsx, Snackbar.test.jsx) así que acá se reemplazan
// por stand-ins mínimos: lo que se verifica es que App realmente los monta a todos bajo
// los mismos providers (Redux/tema/persistencia/routing), no su contenido interno.
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
