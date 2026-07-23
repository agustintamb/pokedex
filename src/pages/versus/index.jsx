import { EmptyState } from '@/components/EmptyState'
import { Page, Title, ScreenPanel } from './index.styles'

export const VersusPage = () => (
  <Page>
    <Title>Versus</Title>
    <ScreenPanel>
      <EmptyState message="Coming soon." />
    </ScreenPanel>
  </Page>
)
