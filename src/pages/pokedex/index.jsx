import pikachuSilhouette from '@/assets/pikachu-silhouette.png'
import { EmptyState } from '@/components/EmptyState'
import { FilterChip } from '@/components/FilterChip'
import { PokemonCard } from '@/components/PokemonCard'
import { SearchSelect } from '@/components/SearchSelect'
import { Skeleton } from '@/components/Skeleton'
import { Loader } from '@/components/Loader'
import { Button } from '@/components/Button'
import { POKEMON_GENERATIONS } from '@/utils/generations'
import { getTypeColor, POKEMON_TYPE_NAMES } from '@/utils/pokemon-types'
import { usePokedexPage } from './usePokedexPage'
import {
  Page,
  ScreenPanel,
  Layout,
  FiltersPanel,
  SearchRow,
  FiltersToggle,
  FiltersBody,
  ToggleIcon,
  FilterGroup,
  FilterGroupTitle,
  FilterChips,
  ListPanel,
  Grid,
  Sentinel,
  ErrorState,
  ErrorContent,
  Silhouette,
} from './index.styles'

const SKELETON_COUNT = 12
const SKELETON_KEYS = Array.from(
  { length: SKELETON_COUNT },
  (_, index) => `skeleton-${index}`,
)

export const PokedexPage = () => {
  const {
    entries,
    isLoading,
    isRetrying,
    isFiltersLoading,
    isError,
    isEmpty,
    hasMore,
    sentinelRef,
    scrollContainerRef,
    handleRetry,
    searchInput,
    handleSearchChange,
    suggestions,
    handleSelectSuggestion,
    handleDismissSuggestions,
    handleSearchFocus,
    selectedTypes,
    handleToggleType,
    selectedGenerations,
    handleToggleGeneration,
    isFiltersOpen,
    toggleFilters,
  } = usePokedexPage()

  const isShowingSkeletons = isLoading || isFiltersLoading
  const activeFilterCount = selectedTypes.length + selectedGenerations.length
  const showError = isError || isRetrying

  return (
    <Page>
      {showError && (
        <ErrorState>
          <ErrorContent>
            <EmptyState message="Ups! Something went wrong while fetching the Pokémons data." />
            <Button
              type="button"
              variant="secondary"
              onClick={handleRetry}
              isLoading={isRetrying}
            >
              Retry
            </Button>
          </ErrorContent>
        </ErrorState>
      )}

      {!showError && (
        <ScreenPanel>
          <Layout>
            <FiltersPanel>
              <SearchRow>
                <SearchSelect
                  label="Name"
                  mobilePrefix="Search by "
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="e.g. Pikachu"
                  options={suggestions}
                  onSelectOption={handleSelectSuggestion}
                  onDismiss={handleDismissSuggestions}
                  onFocus={handleSearchFocus}
                />

                <FiltersToggle
                  type="button"
                  aria-expanded={isFiltersOpen}
                  onClick={toggleFilters}
                >
                  Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
                  <ToggleIcon $isOpen={isFiltersOpen}>▾</ToggleIcon>
                </FiltersToggle>
              </SearchRow>

              <FiltersBody $isOpen={isFiltersOpen}>
                <FilterGroup>
                  <FilterGroupTitle>Type</FilterGroupTitle>
                  <FilterChips>
                    {POKEMON_TYPE_NAMES.map((type) => (
                      <FilterChip
                        key={type}
                        label={type}
                        color={getTypeColor(type)}
                        isActive={selectedTypes.includes(type)}
                        onClick={() => handleToggleType(type)}
                      />
                    ))}
                  </FilterChips>
                </FilterGroup>

                <FilterGroup>
                  <FilterGroupTitle>Generation</FilterGroupTitle>
                  <FilterChips>
                    {POKEMON_GENERATIONS.map((generation) => (
                      <FilterChip
                        key={generation}
                        label={String(generation)}
                        isActive={selectedGenerations.includes(generation)}
                        onClick={() => handleToggleGeneration(generation)}
                      />
                    ))}
                  </FilterChips>
                </FilterGroup>
              </FiltersBody>
            </FiltersPanel>

            <ListPanel ref={scrollContainerRef}>
              {isEmpty ? (
                <EmptyState
                  illustration={<Silhouette src={pikachuSilhouette} alt="" />}
                  message="Who's that Pokémon? Not in your search results!"
                />
              ) : (
                <Grid>
                  {isShowingSkeletons
                    ? SKELETON_KEYS.map((key) => <Skeleton key={key} $height="220px" />)
                    : entries.map(({ name, id }) => (
                        <PokemonCard key={name} name={name} id={id} />
                      ))}
                </Grid>
              )}

              {hasMore && (
                <>
                  <Loader size="28px" />
                  <Sentinel ref={sentinelRef} />
                </>
              )}
            </ListPanel>
          </Layout>
        </ScreenPanel>
      )}
    </Page>
  )
}
