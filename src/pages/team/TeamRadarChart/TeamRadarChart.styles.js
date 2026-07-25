import styled from 'styled-components'

export const ChartBox = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
`

export const Caption = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
  margin-top: ${({ theme }) => theme.space(2)};
  font-size: 0.75rem;
  font-weight: 700;
  justify-content: center;
  color: ${({ theme }) => theme.color.textMuted};
`

export const Swatch = styled.span`
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $color }) => $color};
`

export const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(2)};
  margin-top: ${({ theme }) => theme.space(3)};
`
