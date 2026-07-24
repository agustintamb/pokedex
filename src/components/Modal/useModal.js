import { useEffect } from 'react'

export const useModal = ({ isOpen, onCancel }) => {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  const handlePanelClick = (event) => event.stopPropagation()

  return { handlePanelClick }
}
