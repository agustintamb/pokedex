import { useState } from 'react'

// Detects when detail changes and calls a callback
export const useDetailChange = (detail, onDetailChange) => {
  const [lastDetailId, setLastDetailId] = useState(detail?.id)

  if (detail?.id !== lastDetailId) {
    setLastDetailId(detail?.id)
    onDetailChange?.()
  }
}
