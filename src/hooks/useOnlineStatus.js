import { useSyncExternalStore } from 'react'

const subscribe = (callback) => {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

const getSnapshot = () => navigator.onLine

const getServerSnapshot = () => true

export const useOnlineStatus = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
