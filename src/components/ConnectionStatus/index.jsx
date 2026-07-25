import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { Wrapper, Dot, Label, Hint } from './ConnectionStatus.styles'

export const ConnectionStatus = () => {
  const isOnline = useOnlineStatus()

  return (
    <Wrapper
      role="status"
      aria-live="polite"
      title={isOnline ? 'Live data' : 'Showing saved (cached) data'}
    >
      <Dot $online={isOnline} aria-hidden="true" />
      <Label>{isOnline ? 'Online' : 'Offline'}</Label>
      {!isOnline && <Hint>· cached</Hint>}
    </Wrapper>
  )
}
