import styled from 'styled-components'

export { PageContainer as Page, PageTitle as Title } from '@/styles/page'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.space(4)};
  max-width: 1200px;
  margin: 0 auto;
`

export const Sentinel = styled.div`
  height: 1px;
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
