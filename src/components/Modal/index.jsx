import { createPortal } from 'react-dom'
import { useModal } from './useModal'
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
  const { handlePanelClick } = useModal({ isOpen, onCancel })

  if (!isOpen) return null

  return createPortal(
    <Backdrop onClick={onCancel}>
      <Panel role="dialog" aria-modal="true" onClick={handlePanelClick}>
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
