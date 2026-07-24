import styled from 'styled-components'

// Mismo footprint que TeamCard.Card (160px, 200px desde md) para que las filas del
// grid no salten de alto entre slots ocupados y vacíos
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  width: 160px;
  padding: ${({ theme }) => theme.space(3)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    width: 200px;
  }
`

export const Stage = styled.div`
  width: 96px;
  height: 96px;
  border: 2px dashed ${({ theme }) => theme.color.textFaint};
  border-radius: ${({ theme }) => theme.radius.full};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    width: 120px;
    height: 120px;
  }
`

export const Label = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.color.textFaint};
`
