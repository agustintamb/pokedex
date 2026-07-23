import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => theme.space(10)} ${({ theme }) => theme.space(4)};
  text-align: center;
  color: ${({ theme }) => theme.color.textMuted};
  margin: auto;
`

export const EmptyStateTitle = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.color.textFaint};
`

export const Message = styled.p`
  margin: 0;
  font-weight: 700;
`
