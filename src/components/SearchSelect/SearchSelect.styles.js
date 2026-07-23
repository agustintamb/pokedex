import styled from 'styled-components'

// Mismo layout que FilterGroup (pages/pokedex): label arriba, control debajo
export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
  flex: 1;
  min-width: 0;
`

// Mismo estilo que FilterGroupTitle (pages/pokedex) — headers de sección en toda la app.
// $mobilePrefix antepone texto solo en mobile vía ::before (ver `mobilePrefix` en index.jsx) —
// un solo <h2> en el DOM, sin duplicar heading para lectores de pantalla.
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
  width: 100%;
  padding: ${({ theme }) => theme.space(2)} ${({ theme }) => theme.space(3)};
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme }) => theme.color.surfaceMuted};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.color.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.color.textFaint};
  }
`

// Overlay tipo combobox pegado al input, no empuja nada de lo que lo rodea al aparecer/desaparecer.
// Oculto hasta md por default (pensado para paneles angostos sin lugar debajo del input en mobile) —
export const OptionsList = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: block;
    position: absolute;
    top: calc(100% + ${({ theme }) => theme.space(2)});
    left: 0;
    right: 0;
    z-index: 10;
    max-height: 260px;
    overflow-y: auto;
    padding: ${({ theme }) => theme.space(1)};
    background: ${({ theme }) => theme.color.surface};
    border: 1px solid ${({ theme }) => theme.color.border};
    border-radius: ${({ theme }) => theme.radius.sm};
    box-shadow: ${({ theme }) => theme.shadow.modal};
  }
`

export const Option = styled.button`
  display: block;
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

  &:hover {
    background: ${({ theme }) => theme.color.surfaceMuted};
  }
`
