import { useSearchSelect } from './useSearchSelect'
import {
  Group,
  Label,
  SearchBox,
  SearchInput,
  ErrorHint,
  OptionsList,
  Option,
} from './SearchSelect.styles'

export const SearchSelect = ({
  width,
  label,
  mobilePrefix,
  value,
  onChange,
  placeholder,
  options,
  onSelectOption,
  onDismiss = () => {},
  onFocus = () => {},
  showOptionsOnMobile = false,
  isError = false,
  errorMessage,
  reserveErrorSpace = false,
}) => {
  const { containerRef } = useSearchSelect({ isOpen: options.length > 0, onDismiss })

  return (
    <Group>
      {label && <Label $mobilePrefix={mobilePrefix}>{label}</Label>}

      <SearchBox ref={containerRef}>
        <SearchInput
          $width={width}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          $isError={isError}
          aria-invalid={isError}
        />

        {(reserveErrorSpace || isError) && (
          <ErrorHint>{isError && errorMessage ? errorMessage : ''}</ErrorHint>
        )}

        {options.length > 0 && (
          <OptionsList $alwaysVisible={showOptionsOnMobile}>
            {options.map((option) => (
              <Option key={option} type="button" onClick={() => onSelectOption(option)}>
                {option}
              </Option>
            ))}
          </OptionsList>
        )}
      </SearchBox>
    </Group>
  )
}
