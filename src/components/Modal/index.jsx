import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Backdrop,
  Panel,
  Message,
  Actions,
  ConfirmButton,
  CancelButton,
} from './Modal.styles'

export const Modal = ({
  isOpen,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return createPortal(
    <Backdrop onClick={onCancel}>
      <Panel role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <Message>{message}</Message>
        <Actions>
          <CancelButton type="button" onClick={onCancel}>
            {cancelLabel}
          </CancelButton>
          <ConfirmButton type="button" onClick={onConfirm}>
            {confirmLabel}
          </ConfirmButton>
        </Actions>
      </Panel>
    </Backdrop>,
    document.body,
  )
}
