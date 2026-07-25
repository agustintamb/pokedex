import { useState } from 'react'
import { SearchSelect } from '@/components/SearchSelect'
import { EmptySlot } from '@/components/EmptySlot'
import { Skeleton } from '@/components/Skeleton'
import { getAnimatedSpriteUrl, getSpriteUrl } from '@/utils/pokemon-url'
import { useDetailChange } from './useDetailChange'
import { Column, Stage, Sprite, Name } from './VersusSlot.styles'

export const VersusSlot = ({
  label,
  flip = false,
  query,
  suggestions,
  disabledOptions = [],
  detail,
  isLoading,
  isError,
  errorMessage,
  onQueryChange,
  onSelectOption,
  onDismiss,
  onFocus,
}) => {
  const [hasAnimatedError, setHasAnimatedError] = useState(false)

  useDetailChange(detail, () => {
    if (hasAnimatedError) setHasAnimatedError(false)
  })

  return (
    <Column>
      {isLoading && (
        <>
          <Stage>
            <Skeleton $inset />
          </Stage>
          <Skeleton $width="100px" $height="18px" />
        </>
      )}

      {!isLoading && detail && (
        <Stage>
          <Sprite
            src={
              hasAnimatedError ? getSpriteUrl(detail.id) : getAnimatedSpriteUrl(detail.id)
            }
            alt={detail.name}
            onError={() => setHasAnimatedError(true)}
            $isStatic={hasAnimatedError}
            $flip={flip}
          />
        </Stage>
      )}

      {!isLoading && !detail && (
        <EmptySlot
          label={label}
          size="140px"
          sizeMd="180px"
          labelSize="0.95rem"
          padding="0"
        />
      )}

      {!isLoading && detail && <Name to={`/pokemon/${detail.name}`}>{detail.name}</Name>}

      <SearchSelect
        value={query}
        onChange={onQueryChange}
        options={suggestions}
        disabledOptions={disabledOptions}
        onSelectOption={onSelectOption}
        onDismiss={onDismiss}
        onFocus={onFocus}
        placeholder={`Search ${label}`}
        showOptionsOnMobile
        isError={isError}
        errorMessage={errorMessage}
      />
    </Column>
  )
}
