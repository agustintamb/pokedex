import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, createTestStore, act } from '@/test/render'
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

  // El timer de auto-cierre depende de la identidad del callback de dismiss: si se recrea en
  // cada render, la cuenta del primer snackbar vuelve a cero al aparecer el segundo.
  it('keeps each auto-dismiss countdown running when another snackbar shows up', () => {
    vi.useFakeTimers()
    const store = createTestStore()
    store.dispatch(showSnackbar({ variant: 'success', message: 'First' }))
    renderWithProviders(<SnackbarViewport />, { store })

    act(() => vi.advanceTimersByTime(1500))
    act(() => {
      store.dispatch(showSnackbar({ variant: 'info', message: 'Second' }))
    })

    // Al primero le quedaba 1 s: si el timer se hubiese reiniciado, seguiría en pantalla
    act(() => vi.advanceTimersByTime(1000))

    expect(screen.queryByText('First')).not.toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    vi.useRealTimers()
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
