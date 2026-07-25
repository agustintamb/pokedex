import styled from 'styled-components'
import { Button } from '@/components/Button'
import {
  deviceScreen,
  deviceScreenHeight,
  deviceScreenFill,
  PageContainer,
} from '@/styles/page'

export const Page = styled(PageContainer)`
  ${deviceScreenHeight}
`

// position:relative — TeamCounter se ancla a este panel (position:absolute), no al viewport
export const ScreenPanel = styled.div`
  ${deviceScreen}
  ${deviceScreenFill}
  position: relative;
`

export const Layout = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    gap: ${({ theme }) => theme.space(6)};
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    margin: auto 0;
  }
`

// El grid va primero en el DOM (orden natural en mobile) y desde md se invierte con `order`
export const GridColumn = styled.div`
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    order: 2;
  }
`

export const ChartColumn = styled.div`
  max-width: 360px;
  width: 100%;
  margin: 0 auto;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    flex: 0 0 auto;
    margin: unset;
    order: 1;
  }
`

export const ChartToggle = styled(Button).attrs({ variant: 'muted' })`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.space(3)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: none;
  }
`

export const ToggleIcon = styled.span`
  display: inline-block;
  transition: transform 0.2s ease;
  transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});
`

export const ChartBody = styled.div`
  max-height: ${({ $isOpen }) => ($isOpen ? '70vh' : '0')};
  overflow-y: ${({ $isOpen }) => ($isOpen ? 'auto' : 'hidden')};
  transition: max-height 0.25s ease;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    max-height: none;
    overflow: visible;
  }
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    gap: ${({ theme }) => theme.space(10)} ${({ theme }) => theme.space(5)};
    grid-template-columns: repeat(3, 200px);
  }
`
