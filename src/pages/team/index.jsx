import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { EmptyState } from '@/components/EmptyState'
import { EmptySlot } from '@/components/EmptySlot'
import { SortableTeamSlot } from './SortableTeamSlot'
import { TeamCounter } from './TeamCounter'
import { TeamRadarChart } from './TeamRadarChart'
import { useTeamPage } from './useTeamPage'
import {
  Page,
  ScreenPanel,
  Layout,
  GridColumn,
  ChartColumn,
  ChartToggle,
  ToggleIcon,
  ChartBody,
  Grid,
} from './index.styles'

export const TeamPage = () => {
  const {
    favorites,
    isEmpty,
    slots,
    sensors,
    handleDragEnd,
    maxTeamSize,
    isChartOpen,
    handleToggleChart,
  } = useTeamPage()

  return (
    <Page>
      <ScreenPanel>
        {isEmpty ? (
          <EmptyState message="Oops! Your team is empty. Add some Pokémon to see your team's stats." />
        ) : (
          <>
            <TeamCounter count={favorites.length} max={maxTeamSize} />
            <Layout>
              <GridColumn>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={favorites.map((entry) => entry.id)}
                    strategy={rectSortingStrategy}
                  >
                    <Grid>
                      {slots.map((entry, index) =>
                        entry ? (
                          <SortableTeamSlot
                            key={entry.id}
                            id={entry.id}
                            name={entry.name}
                          />
                        ) : (
                          <EmptySlot key={`empty-${entry?.id ?? index}`} />
                        ),
                      )}
                    </Grid>
                  </SortableContext>
                </DndContext>
              </GridColumn>

              <ChartColumn>
                <ChartToggle type="button" onClick={handleToggleChart}>
                  Team stats
                  <ToggleIcon $isOpen={isChartOpen}>▾</ToggleIcon>
                </ChartToggle>
                <ChartBody $isOpen={isChartOpen}>
                  <TeamRadarChart />
                </ChartBody>
              </ChartColumn>
            </Layout>
          </>
        )}
      </ScreenPanel>
    </Page>
  )
}
