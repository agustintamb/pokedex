import { useEffect, useRef } from 'react'

export const useSearchSelect = ({ isOpen, onDismiss }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      if (!containerRef.current.contains(event.target)) onDismiss()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onDismiss])

  return { containerRef }
}
