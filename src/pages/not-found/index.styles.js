import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { deviceScreen, PageContainer, NAVBAR_DESKTOP_HEIGHT } from '@/styles/page'

// Mismo criterio que Home: a partir de md, la página ocupa el viewport (menos navbar) y no scrollea
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

export const HomeLink = styled(Link)`
  color: ${({ theme }) => theme.color.textMuted};
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: ${({ theme }) => theme.color.textPrimary};
  }
`
