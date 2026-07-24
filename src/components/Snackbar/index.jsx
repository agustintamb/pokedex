import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { dismissSnackbar, selectSnackbars } from '@/store/slices/ui.slice'
import { useSnackbarItem } from './useSnackbarItem'
import { Viewport, SnackbarCard, SnackbarText, SnackbarDismiss } from './Snackbar.styles'

const SnackbarItem = ({ snackbar, position }) => {
  const dispatch = useDispatch()
  const handleDismiss = () => dispatch(dismissSnackbar(snackbar.id))
  useSnackbarItem(snackbar.id, handleDismiss)

  return (
    <SnackbarCard $variant={snackbar.variant} $position={position} role="status">
      <SnackbarText>{snackbar.message}</SnackbarText>
      <SnackbarDismiss
        type="button"
        aria-label={`Dismiss ${snackbar.variant} notification`}
        onClick={handleDismiss}
      >
        ×
      </SnackbarDismiss>
    </SnackbarCard>
  )
}

export const SnackbarViewport = ({ position = 'top-center' }) => {
  const snackbars = useSelector(selectSnackbars)

  if (!snackbars.length) return null

  return createPortal(
    <Viewport $position={position} aria-live="polite">
      {snackbars.map((snackbar) => (
        <SnackbarItem key={snackbar.id} snackbar={snackbar} position={position} />
      ))}
    </Viewport>,
    document.body,
  )
}
