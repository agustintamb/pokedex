import { useState } from 'react'

export const useDetailChange = (detail, onDetailChange) => {
  const [lastDetailId, setLastDetailId] = useState(detail?.id)

  if (detail?.id !== lastDetailId) {
    setLastDetailId(detail?.id)
    onDetailChange?.()
  }
}
