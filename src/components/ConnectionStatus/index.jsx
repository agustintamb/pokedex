import { useSelector } from 'react-redux'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { selectHasCachedData } from '@/api/pokeApi'
import { selectDataSource } from '@/store/slices/ui.slice'
import { Wrapper, Dot, Label, Hint } from './ConnectionStatus.styles'

const getQualifier = ({ isOnline, dataSource, hasCachedData }) => {
  if (!isOnline) return hasCachedData ? 'cached' : null
  if (dataSource === 'fetched') return 'fetched'
  return hasCachedData ? 'cached' : null
}

const TITLE_BY_QUALIFIER = {
  fetched: 'Live data',
  cached: 'Showing saved (cached) data',
}

export const ConnectionStatus = () => {
  const isOnline = useOnlineStatus()
  const dataSource = useSelector(selectDataSource)
  const hasCachedData = useSelector(selectHasCachedData)
  const qualifier = getQualifier({ isOnline, dataSource, hasCachedData })

  return (
    <Wrapper
      role="status"
      aria-live="polite"
      title={TITLE_BY_QUALIFIER[qualifier] ?? (isOnline ? 'Online' : 'Offline')}
    >
      <Dot $online={isOnline} aria-hidden="true" />
      <Label>{isOnline ? 'Online' : 'Offline'}</Label>
      {qualifier && <Hint>· {qualifier}</Hint>}
    </Wrapper>
  )
}
