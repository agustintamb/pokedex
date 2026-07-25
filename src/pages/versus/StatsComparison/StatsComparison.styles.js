import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
`

export const Caption = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space(4)};
  margin-bottom: ${({ theme }) => theme.space(3)};
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.color.textMuted};
`

export const CaptionEntry = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
  text-transform: capitalize;
`

export const Swatch = styled.span`
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $color }) => $color};
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(3)};
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr 36px 36px;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
`

export const StatLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.color.textMuted};
`

// Track compartido por los dos Pokémon — los dos Fill arrancan del mismo borde izquierdo
// y se superponen, en vez de barras separadas una al lado de la otra
export const Track = styled.div`
  position: relative;
  height: 10px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surfaceMuted};
`

export const Fill = styled.div`
  position: absolute;
  inset: 0;
  width: ${({ $percentage }) => $percentage}%;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $color }) => $color};
  opacity: 0.65;
  transition: width 0.6s ease;
`

export const Value = styled.span`
  text-align: right;
  font-family: ${({ theme }) => theme.font.mono};
  font-size: 0.75rem;
  font-weight: ${({ $isWinner }) => ($isWinner ? 700 : 400)};
  color: ${({ $isWinner, theme }) =>
    $isWinner ? theme.color.success : theme.color.textPrimary};
`
