import styled from 'styled-components'

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.space(1)} ${({ theme }) => theme.space(2)};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $color }) => $color};
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.02em;
  line-height: 1.4;
`
