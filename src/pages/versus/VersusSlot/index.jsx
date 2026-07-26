import { SearchSelect } from '@/components/SearchSelect'
import { EmptySlot } from '@/components/EmptySlot'
import { Skeleton } from '@/components/Skeleton'
import { useAnimatedSprite } from '@/hooks/useAnimatedSprite'
import { Column, Stage, Sprite, Name } from './VersusSlot.styles'

export const VersusSlot = ({
  label,
  flip = false,
  query,
  suggestions,
  detail,
  isLoading,
  isError,
  errorMessage,
  onQueryChange,
  onSelectOption,
  onDismiss,
  onFocus,
}) => {
  const sprite = useAnimatedSprite(detail?.id)
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
            src={sprite.src}
            alt={detail.name}
            onError={sprite.onError}
            $isStatic={sprite.isStatic}
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
        width={200}
        value={query}
        onChange={onQueryChange}
        options={suggestions}
        onSelectOption={onSelectOption}
        onDismiss={onDismiss}
        onFocus={onFocus}
        placeholder={`Search ${label}`}
        showOptionsOnMobile
        isError={isError}
        errorMessage={errorMessage}
        reserveErrorSpace
      />
    </Column>
  )
}
