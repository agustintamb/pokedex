import styled from 'styled-components'
import { deviceScreen, PageContainer, NAVBAR_DESKTOP_HEIGHT } from '@/styles/page'

export const Page = styled(PageContainer)`
  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    height: calc(100vh - (${NAVBAR_DESKTOP_HEIGHT} + 48px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`

export const ScreenPanel = styled.div`
  ${deviceScreen}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(4)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
`

export const AnimationFrame = styled.div`
  width: 220px;
  height: 220px;
`
