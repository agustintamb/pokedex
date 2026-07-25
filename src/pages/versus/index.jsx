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
} from './index.styles'

export const VersusPage = () => {
  const { slotA, slotB, displayNameA, displayNameB, statRows, onRandomize } =
    useVersusPage()

  return (
    <Page>
      <ScreenPanel>
        <Content>
          <Arena>
            <VersusSlot label="Pokemon 1" flip {...slotA} />
            <VsRow>
              <VsBadge>VS</VsBadge>
              <ActionsRow>
                <RandomVersusButton onClick={onRandomize} />
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
