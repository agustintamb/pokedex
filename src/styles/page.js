import styled, { css } from 'styled-components'

export const NAVBAR_MOBILE_HEIGHT = '88px'
export const NAVBAR_DESKTOP_HEIGHT = '100px'

export const deviceScreen = css`
  width: 100%;
  max-width: 1264px;
  margin: 0 auto;
  margin-bottom: ${({ theme }) => theme.space(4)};
  padding: ${({ theme }) => theme.space(5)};
  padding-right: ${({ theme }) => theme.space(3)};
  background: ${({ theme }) => theme.color.surfaceSection};
  border: 3px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`

export const deviceScreenHeight = css`
  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    height: calc(100vh - (${NAVBAR_DESKTOP_HEIGHT} + 46px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`

export const deviceScreenFill = css`
  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
`

export const PageContainer = styled.main`
  background: ${({ theme }) => theme.color.background};
  padding: ${({ theme }) => theme.space(0)} ${({ theme }) => theme.space(4)};
`

export const ErrorState = styled.div`
  ${deviceScreen}
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(4)};
`
