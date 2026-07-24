import styled from 'styled-components'

// Absolute (no fixed): se ancla a la esquina del contenedor (ScreenPanel, position:relative),
// no al viewport del navegador. Necesita su propio fondo/borde porque flota sobre contenido
// variable, ya no es texto suelto en el flujo
export const Count = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.space(4)};
  bottom: ${({ theme }) => theme.space(4)};
  z-index: 15;
  padding: ${({ theme }) => theme.space(2)} ${({ theme }) => theme.space(3)};
  background: ${({ theme }) => theme.color.surface};
  border: 2px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.full};
  box-shadow: ${({ theme }) => theme.shadow.card};
  font-family: ${({ theme }) => theme.font.mono};
  font-weight: 700;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.color.textPrimary};
`
