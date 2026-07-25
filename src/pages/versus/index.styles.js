import styled, { keyframes } from 'styled-components'
import {
  deviceScreen,
  deviceScreenHeight,
  deviceScreenFill,
  PageContainer,
} from '@/styles/page'

export { ErrorState, ErrorContent } from '@/styles/page'

export const Page = styled(PageContainer)`
  ${deviceScreenHeight}
`

export const ScreenPanel = styled.div`
  ${deviceScreen}
  ${deviceScreenFill}
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(5)};
  justify-content: center;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scrollbar-gutter: stable;
    padding-right: ${({ theme }) => theme.space(3)};
  }
`

export const Arena = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space(4)};
  }
`

const clash = keyframes`
  0%, 100% { transform: scale(1) rotate(-4deg); }
  50% { transform: scale(1.18) rotate(4deg); }
`

export const VsBadge = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 84px;
  height: 84px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: radial-gradient(
    circle,
    ${({ theme }) => theme.color.primarySoft} 0%,
    transparent 72%
  );
  font-size: 2.25rem;
  font-weight: 900;
  font-style: italic;
  color: ${({ theme }) => theme.color.primary};
  text-shadow: 2px 2px 0 ${({ theme }) => theme.color.border};
  animation: ${clash} 1.8s ease-in-out infinite;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    width: 130px;
    height: 170px;
    font-size: 3.5rem;
    margin-top: ${({ theme }) => theme.space(13)};
  }
`

export const ActionsRow = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  margin-left: ${({ theme }) => theme.space(2)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    top: auto;
    left: 0;
    right: 0;
    transform: none;
    margin-left: 0;
    z-index: 1;
  }
`

// Ancla para ActionsRow en mobile. Desde md, display:contents desacopla el layout.
export const VsRow = styled.div`
  position: relative;
  display: flex;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: contents;
  }
`

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`

export const ComparisonSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(4)};
  animation: ${scaleIn} 0.2s ease-out;
`
