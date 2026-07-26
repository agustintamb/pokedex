import { FavoriteToggle } from '@/components/FavoriteToggle'
import { Modal } from '@/components/Modal'
import { Switch } from '@/components/Switch'
import { Tooltip } from '@/components/Tooltip'
import { TypeBadge } from '@/components/TypeBadge'
import { StatBar } from '@/components/StatBar'
import { SpriteViewer } from '@/components/SpriteViewer'
import { Skeleton } from '@/components/Skeleton'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/Button'
import { formatHeight, formatWeight, getStatLabel } from '@/utils/format-stats'
import { useDetailPage } from './useDetailPage'
import {
  Page,
  CenteredScreen,
  ErrorContent,
  Content,
  ContentBody,
  DexNumber,
  NameTitle,
  Layout,
  LeftColumn,
  RightColumn,
  Stage,
  ArtworkFrame,
  ArtworkImage,
  FavoriteSlot,
  ShinyToggleRow,
  ShinyToggleLabel,
  TypesRow,
  TypesLabel,
  Section,
  SectionTitle,
  SectionToggle,
  ToggleIcon,
  MeasurementsList,
  MeasurementRow,
  MeasurementLabel,
  AbilitiesList,
  AbilityItem,
  StatsList,
} from './index.styles'

export const DetailPage = () => {
  const {
    detail,
    isLoading,
    isRetrying,
    isError,
    handleRetry,
    artworkSrc,
    spriteEntries,
    selectedSprite,
    handleSelectSprite,
    isShiny,
    handleToggleShiny,
    isAbilitiesOpen,
    handleToggleAbilities,
    isMeasurementsOpen,
    handleToggleMeasurements,
    isFavorite,
    isModalOpen,
    modalMessage,
    handleToggleClick,
    handleConfirm,
    handleCancel,
  } = useDetailPage()

  return (
    <Page>
      {isLoading && (
        <Content>
          <ContentBody>
            <Skeleton $height="24px" $width="60%" />
            <Layout>
              <LeftColumn>
                <Stage>
                  <ArtworkFrame>
                    <Skeleton $inset />
                  </ArtworkFrame>
                </Stage>
              </LeftColumn>
              <RightColumn>
                <Skeleton $height="24px" $width="40%" />
                <Skeleton $height="80px" />
                <Skeleton $height="120px" />
              </RightColumn>
            </Layout>
          </ContentBody>
        </Content>
      )}

      {/* El reintento mantiene el estado de error en pantalla (con el spinner en el botón)
          en vez de dejar la página en blanco mientras la request está en vuelo. */}
      {(isError || isRetrying) && (
        <CenteredScreen>
          <ErrorContent>
            <EmptyState message="Couldn't load this Pokémon." />
            <Button
              type="button"
              variant="secondary"
              onClick={handleRetry}
              isLoading={isRetrying}
            >
              Retry
            </Button>
          </ErrorContent>
        </CenteredScreen>
      )}

      {detail && (
        <Content>
          <Modal
            isOpen={isModalOpen}
            message={modalMessage}
            confirmLabel={isFavorite ? 'Remove' : 'Add'}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />

          <FavoriteSlot>
            <Tooltip
              label={isFavorite ? 'Remove from team' : 'Add to team'}
              position="top"
            >
              <FavoriteToggle
                isFavorite={isFavorite}
                onClick={handleToggleClick}
                name={detail.name}
                size="36px"
              />
            </Tooltip>
          </FavoriteSlot>

          <ContentBody>
            <Layout>
              <LeftColumn>
                <NameTitle>{detail.name}</NameTitle>
                <Stage>
                  <ArtworkFrame>
                    <ArtworkImage src={artworkSrc} alt={detail.name} />
                  </ArtworkFrame>

                  <ShinyToggleRow>
                    <ShinyToggleLabel>Shiny</ShinyToggleLabel>
                    <Switch
                      isOn={isShiny}
                      onClick={handleToggleShiny}
                      ariaLabel="Toggle shiny sprites"
                    />
                  </ShinyToggleRow>

                  <SpriteViewer
                    sprites={spriteEntries}
                    selected={selectedSprite}
                    selectedKey={selectedSprite?.key}
                    onSelect={handleSelectSprite}
                    alt={detail.name}
                  />
                </Stage>
              </LeftColumn>

              <RightColumn>
                <TypesRow>
                  <TypesLabel>Type</TypesLabel>
                  {detail.types.map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </TypesRow>

                <Section>
                  <SectionToggle type="button" onClick={handleToggleMeasurements}>
                    Physical data
                    <ToggleIcon $isOpen={isMeasurementsOpen}>▾</ToggleIcon>
                  </SectionToggle>
                  {isMeasurementsOpen && (
                    <MeasurementsList>
                      <MeasurementRow>
                        <MeasurementLabel>Height</MeasurementLabel>
                        {formatHeight(detail.height)}
                      </MeasurementRow>
                      <MeasurementRow>
                        <MeasurementLabel>Weight</MeasurementLabel>
                        {formatWeight(detail.weight)}
                      </MeasurementRow>
                    </MeasurementsList>
                  )}
                </Section>

                <Section>
                  <SectionToggle type="button" onClick={handleToggleAbilities}>
                    Abilities
                    <ToggleIcon $isOpen={isAbilitiesOpen}>▾</ToggleIcon>
                  </SectionToggle>
                  {isAbilitiesOpen && (
                    <AbilitiesList>
                      {detail.abilities.map((ability) => (
                        <AbilityItem key={ability.name}>
                          {ability.name}
                          {ability.isHidden ? ' (hidden)' : ''}
                        </AbilityItem>
                      ))}
                    </AbilitiesList>
                  )}
                </Section>

                <Section>
                  <SectionTitle>Stats</SectionTitle>
                  <StatsList>
                    {detail.stats.map((stat) => (
                      <StatBar
                        key={stat.name}
                        label={getStatLabel(stat.name)}
                        value={stat.value}
                      />
                    ))}
                  </StatsList>
                </Section>
              </RightColumn>
            </Layout>
          </ContentBody>

          <DexNumber>N.º {String(detail.id).padStart(3, '0')}</DexNumber>
        </Content>
      )}
    </Page>
  )
}
