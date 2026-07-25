import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(36, 36, 35, 0.45);
  backdrop-filter: blur(3px);
  animation: ${fadeIn} 0.2s ease-out;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    align-items: center;
    padding: ${({ theme }) => theme.space(4)};
  }
`

export const Panel = styled.div`
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.space(6)} ${({ theme }) => theme.space(5)};
  background: ${({ theme }) => theme.color.surface};
  border: 3px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.radius.lg} ${({ theme }) => theme.radius.lg} 0 0;
  box-shadow: ${({ theme }) => theme.shadow.modal};
  animation: ${slideUp} 0.2s ease-out;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    border-radius: ${({ theme }) => theme.radius.lg};
    animation: ${scaleIn} 0.2s ease-out;
  }
`

export const Message = styled.p`
  margin: 0 0 ${({ theme }) => theme.space(5)};
  color: ${({ theme }) => theme.color.textPrimary};
  font-size: 0.95rem;
  line-height: 1.5;
  text-align: center;
`

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space(3)};

  & > * {
    flex: 1;
  }
`
