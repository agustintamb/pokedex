import styled from 'styled-components'

export const Row = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr 32px;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
`

export const Label = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.color.textMuted};
`

export const Track = styled.div`
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surfaceMuted};
  overflow: hidden;
`

export const Fill = styled.div`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  background: ${({ theme }) => theme.color.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  transition: width 0.6s ease;
`

export const Value = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 0.75rem;
  text-align: right;
  color: ${({ theme }) => theme.color.textPrimary};
`
