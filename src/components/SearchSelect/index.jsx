import { useSearchSelect } from './useSearchSelect'
import {
  Group,
  Label,
  SearchBox,
  SearchInput,
  OptionsList,
  Option,
} from './SearchSelect.styles'

export const SearchSelect = ({
  label,
  mobilePrefix,
  value,
  onChange,
  placeholder,
  options,
  onSelectOption,
  onDismiss = () => {},
  onFocus = () => {},
}) => {
  const { containerRef } = useSearchSelect({ isOpen: options.length > 0, onDismiss })

  return (
    <Group>
      {label && <Label $mobilePrefix={mobilePrefix}>{label}</Label>}

      <SearchBox ref={containerRef}>
        <SearchInput
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
        />

        {options.length > 0 && (
          <OptionsList>
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
