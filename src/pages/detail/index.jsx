import { FavoriteToggle } from '@/components/FavoriteToggle'
import { Modal } from '@/components/Modal'
import { Switch } from '@/components/Switch'
import { Tooltip } from '@/components/Tooltip'
import { TypeBadge } from '@/components/TypeBadge'
import { StatBar } from '@/components/StatBar'
import { SpriteViewer } from '@/components/SpriteViewer'
import { Skeleton } from '@/components/Skeleton'
import { formatHeight, formatWeight, getStatLabel } from '@/utils/format-stats'
import { useDetailPage } from './useDetailPage'
import {
  Page,
  ErrorState,
  RetryButton,
  Content,
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
        </Content>
      )}

      {isError && (
        <ErrorState>
          <p>Couldn&apos;t load this Pokémon.</p>
          <RetryButton type="button" onClick={handleRetry}>
            Retry
          </RetryButton>
        </ErrorState>
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
            <Tooltip label={isFavorite ? 'Remove from team' : 'Add to team'}>
              <FavoriteToggle
                isFavorite={isFavorite}
                onClick={handleToggleClick}
                name={detail.name}
                size="36px"
              />
            </Tooltip>
          </FavoriteSlot>

          <NameTitle>{detail.name}</NameTitle>

          <Layout>
            <LeftColumn>
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

          <DexNumber>N.º {String(detail.id).padStart(3, '0')}</DexNumber>
        </Content>
      )}
    </Page>
  )
}
