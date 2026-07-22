import { PokemonCard } from '@/components/PokemonCard'
import { Skeleton } from '@/components/Skeleton'
import { usePokedexPage } from './usePokedexPage'
import { Page, Title, Grid, Sentinel, ErrorState, RetryButton } from './index.styles'

const SKELETON_COUNT = 12
const SKELETON_KEYS = Array.from(
  { length: SKELETON_COUNT },
  (_, index) => `skeleton-${index}`,
)

export const PokedexPage = () => {
  const { entries, isLoading, isError, hasMore, sentinelRef, handleRetry } =
    usePokedexPage()

  return (
    <Page>
      <Title>Pokédex</Title>

      {isError && (
        <ErrorState>
          <p>Couldn&apos;t load the Pokédex index.</p>
          <RetryButton type="button" onClick={handleRetry}>
            Retry
          </RetryButton>
        </ErrorState>
      )}

      {!isError && (
        <Grid>
          {isLoading
            ? SKELETON_KEYS.map((key) => <Skeleton key={key} $height="220px" />)
            : entries.map(({ name, id }) => (
                <PokemonCard key={name} name={name} id={id} />
              ))}
        </Grid>
      )}

      {hasMore && <Sentinel ref={sentinelRef} />}
    </Page>
  )
}
