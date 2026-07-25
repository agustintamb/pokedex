import styled from 'styled-components'
import { Button } from '@/components/Button'
import {
  deviceScreen,
  deviceScreenHeight,
  PageContainer,
  NAVBAR_MOBILE_HEIGHT,
} from '@/styles/page'

export { ErrorState, ErrorContent } from '@/styles/page'

export const Page = styled(PageContainer)`
  height: calc(100vh - (${NAVBAR_MOBILE_HEIGHT} + ${({ theme }) => theme.space(4)}));
  display: flex;
  flex-direction: column;
  overflow: hidden;

  ${deviceScreenHeight}
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

export const SearchRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.space(2)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    order: 2;
  }
`

export const FiltersToggle = styled(Button).attrs({ variant: 'muted' })`
  flex-shrink: 0;
  white-space: nowrap;

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
