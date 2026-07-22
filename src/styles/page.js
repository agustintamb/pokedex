import styled from 'styled-components'

export const PageContainer = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.color.background};
  padding: ${({ theme }) => theme.space(6)} ${({ theme }) => theme.space(4)};
`

export const PageTitle = styled.h1`
  font-weight: 700;
  color: ${({ theme }) => theme.color.onBackground};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space(6)};
`
