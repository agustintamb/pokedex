import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, createTestStore } from '@/test/render'
import { showSnackbar } from '@/store/slices/ui.slice'
import { SnackbarViewport } from './index'

describe('SnackbarViewport', () => {
  it('renders nothing when there are no snackbars', () => {
    renderWithProviders(<SnackbarViewport />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders a snackbar dispatched to the store, via a portal to document.body', () => {
    const store = createTestStore()
    store.dispatch(showSnackbar({ variant: 'success', message: 'Added!' }))

    renderWithProviders(<SnackbarViewport />, { store })

    expect(screen.getByText('Added!')).toBeInTheDocument()
  })

  it('dismisses a snackbar when its dismiss button is clicked', async () => {
    const user = userEvent.setup()
    const store = createTestStore()
    store.dispatch(showSnackbar({ variant: 'info', message: 'Removed!' }))

    renderWithProviders(<SnackbarViewport />, { store })
    await user.click(screen.getByRole('button', { name: 'Dismiss info notification' }))

    expect(screen.queryByText('Removed!')).not.toBeInTheDocument()
    expect(store.getState().ui.snackbars).toEqual([])
  })

  it('renders one card per snackbar in the store', () => {
    const store = createTestStore()
    store.dispatch(showSnackbar({ variant: 'success', message: 'First' }))
    store.dispatch(showSnackbar({ variant: 'error', message: 'Second' }))

    renderWithProviders(<SnackbarViewport />, { store })

    expect(screen.getAllByRole('status')).toHaveLength(2)
  })

  // Nadie las usa hoy (el Viewport siempre monta el default), pero son API pública
  it.each(['top-left', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'])(
    'renders without crashing at position="%s"',
    (position) => {
      const store = createTestStore()
      store.dispatch(showSnackbar({ variant: 'info', message: 'Hi' }))
      renderWithProviders(<SnackbarViewport position={position} />, { store })
      expect(screen.getByText('Hi')).toBeInTheDocument()
    },
  )
})
