import { useSyncExternalStore } from 'react'

// Estado de conexión del navegador. useSyncExternalStore es el primitivo pensado para esto
// (una fuente externa a React con su propia suscripción) — no va en Redux porque es estado
// efímero del dispositivo, no del dominio de la app.
const subscribe = (callback) => {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

const getSnapshot = () => navigator.onLine

// En SSR no hay `navigator`; se asume online para no marcar "sin conexión" en el HTML inicial.
const getServerSnapshot = () => true

export const useOnlineStatus = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
