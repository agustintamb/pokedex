import styled from 'styled-components'
import { deviceScreen, PageContainer } from '@/styles/page'
import {
  NAVBAR_MOBILE_HEIGHT,
  NAVBAR_DESKTOP_HEIGHT,
} from '@/components/Navbar/Navbar.styles'

export { PageTitle as Title, ErrorState, RetryButton } from '@/styles/page'

// Ocupa el viewport completo (menos el navbar) y no scrollea, en mobile y desktop —
// solo el ListPanel scrollea adentro, así el borde de deviceScreen nunca queda cortado
export const Page = styled(PageContainer)`
  height: calc(100vh - (${NAVBAR_MOBILE_HEIGHT} + ${({ theme }) => theme.space(4)}));
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    height: calc(100vh - (${NAVBAR_DESKTOP_HEIGHT} + 48px));
  }
`

export const ScreenPanel = styled.div`
  ${deviceScreen}
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  min-height: 0;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    gap: ${({ theme }) => theme.space(4)};
    flex-direction: row;
    align-items: flex-start;
  }
`

// Mobile: acordeón arriba del listado, buscador siempre visible, chips colapsados hasta expandir.
// flex-shrink:0 en las dos resoluciones: FiltersPanel mantiene su alto natural, el que cede
// espacio cuando falta es siempre ListPanel (flex:1 más abajo), nunca el panel de filtros.
export const FiltersPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => theme.space(3)};
  background: ${({ theme }) => theme.color.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  margin-bottom: ${({ theme }) => theme.space(3)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    gap: ${({ theme }) => theme.space(4)};
    width: 258px;
    height: 100%;
    margin-bottom: 0;
    border-radius: ${({ theme }) => theme.radius.md};
    box-shadow: none;
  }
`

// Solo desktop: el search pasa a último, los chips de tipo/generación van arriba (ver FiltersBody)
export const SearchRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space(2)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    order: 2;
  }
`

export const FiltersToggle = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${({ theme }) => theme.color.textPrimary};
  background: ${({ theme }) => theme.color.surfaceMuted};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space(2)} ${({ theme }) => theme.space(3)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: none;
  }
`

export const ToggleIcon = styled.span`
  display: inline-block;
  transition: transform 0.2s ease;
  transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});
`

// max-height en vez de mount/unmount, para poder animarlo
export const FiltersBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
  max-height: ${({ $isOpen }) => ($isOpen ? '50vh' : '0')};
  overflow-y: ${({ $isOpen }) => ($isOpen ? 'auto' : 'hidden')};
  transition: max-height 0.25s ease;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    max-height: none;
    overflow: visible;
    order: 1;
  }
`

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`

export const FilterGroupTitle = styled.h2`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.color.textMuted};
  margin: 0;
`

export const FilterChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(1)};
`

// scrollbar-gutter:stable evita que el ancho salte al aparecer el scroll. flex:1 + min-height:0
// en las dos resoluciones: es el único que scrollea/cede espacio dentro de Layout (ver FiltersPanel)
export const ListPanel = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  align-self: stretch;
  min-height: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
  border-radius: ${({ theme }) => theme.radius.md};
  padding-right: ${({ theme }) => theme.space(3)};
`

// auto-fill decide las columnas según el ancho: 1 en mobile, hasta 3 en desktop
export const Grid = styled.div`
  display: grid;
  padding-top: 2px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.space(3)};
`

export const Sentinel = styled.div`
  height: 1px;
`

// brightness(0) convierte el artwork a color en silueta negra
export const Silhouette = styled.img`
  width: 160px;
  height: 160px;
  object-fit: contain;
  filter: brightness(0);
`
