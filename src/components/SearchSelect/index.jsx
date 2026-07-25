import { useSearchSelect } from './useSearchSelect'
import {
  Group,
  Label,
  SearchBox,
  SearchInput,
  ErrorHint,
  OptionsList,
  Option,
  OptionHint,
} from './SearchSelect.styles'

export const SearchSelect = ({
  label,
  mobilePrefix,
  value,
  onChange,
  placeholder,
  options,
  disabledOptions = [],
  onSelectOption,
  onDismiss = () => {},
  onFocus = () => {},
  showOptionsOnMobile = false,
  isError = false,
  errorMessage,
}) => {
  const { containerRef } = useSearchSelect({ isOpen: options.length > 0, onDismiss })

  return (
    <Group>
      {label && <Label $mobilePrefix={mobilePrefix}>{label}</Label>}

      <SearchBox ref={containerRef}>
        <SearchInput
          $width={200}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          $isError={isError}
          aria-invalid={isError}
        />

        <ErrorHint>{isError && errorMessage ? errorMessage : ''}</ErrorHint>

        {options.length > 0 && (
          <OptionsList $alwaysVisible={showOptionsOnMobile}>
            {options.map((option) => {
              const isDisabled = disabledOptions.includes(option)
              return (
                <Option
                  key={option}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectOption(option)}
                >
                  {option}
                  {isDisabled && <OptionHint>Already picked</OptionHint>}
                </Option>
              )
            })}
          </OptionsList>
        )}
      </SearchBox>
    </Group>
  )
}
