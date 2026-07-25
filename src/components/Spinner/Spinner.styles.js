import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

export const Rotator = styled.span`
  display: inline-flex;
  animation: ${spin} 0.8s linear infinite;
`
