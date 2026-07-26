import styled from 'styled-components'

export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
  flex: 1;
  min-width: 0;
`

export const Label = styled.h2`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.color.textMuted};
  margin: 0;

  &::before {
    content: '${({ $mobilePrefix }) => $mobilePrefix ?? ''}';
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    &::before {
      content: none;
    }
  }
`

export const SearchBox = styled.div`
  position: relative;
  width: 100%;
`

export const SearchInput = styled.input`
  width: ${({ $width }) => ($width ? `${$width}px` : '100%')};
  padding: ${({ theme }) => theme.space(2)} ${({ theme }) => theme.space(3)};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid
    ${({ $isError, theme }) => ($isError ? theme.color.danger : 'transparent')};
  background: ${({ $isError, theme }) =>
    $isError ? theme.color.dangerSoft : theme.color.surfaceMuted};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.color.textPrimary};
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.color.textFaint};
  }

  &:focus-visible {
    outline-offset: -2px;
  }
`

export const ErrorHint = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.space(1)};
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.color.danger};
  min-height: calc(1.2em * 2);
`

export const OptionsList = styled.div`
  display: ${({ $alwaysVisible }) => ($alwaysVisible ? 'block' : 'none')};
  max-height: 260px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space(1)};
  background: ${({ theme }) => theme.color.surface};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  top: 44px;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 10;
    box-shadow: ${({ theme }) => theme.shadow.modal};
  }
`

export const Option = styled.button`
  display: flex;
  align-items: baseline;
  width: 100%;
  text-align: left;
  padding: ${({ theme }) => theme.space(1)} ${({ theme }) => theme.space(2)};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: none;
  color: ${({ theme }) => theme.color.textPrimary};
  text-transform: capitalize;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.color.surfaceMuted};
    outline: none;
  }
`
