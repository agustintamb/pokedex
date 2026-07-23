import { EmptyState } from '@/components/EmptyState'
import { Page, Title, ScreenPanel } from './index.styles'

export const TeamPage = () => (
  <Page>
    <Title>My Team</Title>
    <ScreenPanel>
      <EmptyState message="Coming soon." />
    </ScreenPanel>
  </Page>
)
