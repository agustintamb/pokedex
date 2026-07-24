import { useEffect } from 'react'

const AUTO_DISMISS_MS = 2500

export const useSnackbarItem = (id, dismiss) => {
  useEffect(() => {
    const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [id, dismiss])
}
