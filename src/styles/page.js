import styled, { css } from 'styled-components'

// Compartido entre Home y Detalle, mismo tamaño en las dos
export const deviceScreen = css`
  width: 100%;
  max-width: 1264px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space(5)};
  padding-right: ${({ theme }) => theme.space(3)};
  background: ${({ theme }) => theme.color.surfaceSection};
  border: 3px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`

export const PageContainer = styled.main`
  background: ${({ theme }) => theme.color.background};
  padding: ${({ theme }) => theme.space(0)} ${({ theme }) => theme.space(4)};
`

export const PageTitle = styled.h1`
  font-weight: 700;
  color: ${({ theme }) => theme.color.onBackground};
  text-align: center;
  text-transform: capitalize;
  margin-bottom: ${({ theme }) => theme.space(6)};
`

export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(4)};
  padding: ${({ theme }) => theme.space(10)} 0;
  color: ${({ theme }) => theme.color.onBackground};
`

export const RetryButton = styled.button`
  padding: ${({ theme }) => theme.space(2)} ${({ theme }) => theme.space(5)};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.primary};
  font-weight: 700;
`
