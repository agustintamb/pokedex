import { EmptyState } from '@/components/EmptyState'
import { Spinner } from '@/components/Spinner'
import { Button } from '@/components/Button'
import { VersusSlot } from './VersusSlot'
import { StatsComparison } from './StatsComparison'
import { RandomVersusButton } from './RandomVersusButton'
import { useVersusPage } from './useVersusPage'
import {
  Page,
  ScreenPanel,
  Content,
  Arena,
  VsRow,
  VsBadge,
  ActionsRow,
  ComparisonSection,
  CenteredScreen,
  ErrorContent,
} from './index.styles'

export const VersusPage = () => {
  const {
    slotA,
    slotB,
    displayNameA,
    displayNameB,
    statRows,
    onRandomize,
    isRandomizing,
    isLoading,
    isRetrying,
    isError,
    onRetry,
  } = useVersusPage()

  if (isError || isRetrying)
    return (
      <Page>
        <CenteredScreen>
          <ErrorContent>
            <EmptyState message="Ups! Something went wrong while fetching the Pokémons data." />
            <Button
              type="button"
              variant="secondary"
              onClick={onRetry}
              isLoading={isRetrying}
            >
              Retry
            </Button>
          </ErrorContent>
        </CenteredScreen>
      </Page>
    )

  if (isLoading)
    return (
      <Page>
        <CenteredScreen>
          <Spinner size="52px" label="Loading" />
        </CenteredScreen>
      </Page>
    )

  return (
    <Page>
      <ScreenPanel>
        <Content>
          <Arena>
            <VersusSlot label="Pokemon 1" flip {...slotA} />
            <VsRow>
              <VsBadge>VS</VsBadge>
              <ActionsRow>
                <RandomVersusButton onClick={onRandomize} isLoading={isRandomizing} />
              </ActionsRow>
            </VsRow>
            <VersusSlot label="Pokemon 2" {...slotB} />
          </Arena>

          <ComparisonSection>
            <StatsComparison
              statRows={statRows}
              nameA={displayNameA}
              nameB={displayNameB}
            />
          </ComparisonSection>
        </Content>
      </ScreenPanel>
    </Page>
  )
}
