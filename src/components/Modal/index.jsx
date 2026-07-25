import { createPortal } from 'react-dom'
import { Button } from '@/components/Button'
import { useModal } from './useModal'
import { Backdrop, Panel, Message, Actions } from './Modal.styles'

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
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="primary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Actions>
      </Panel>
    </Backdrop>,
    document.body,
  )
}
