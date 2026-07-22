import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% { background-position: -150% 0; }
  100% { background-position: 150% 0; }
`

export const Skeleton = styled.div`
  position: ${({ $inset }) => ($inset ? 'absolute' : 'relative')};
  inset: ${({ $inset }) => ($inset ? 0 : 'auto')};
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $inset, $height }) => $height || ($inset ? '100%' : '16px')};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.color.surfaceMuted} 25%,
    ${({ theme }) => theme.color.surface} 50%,
    ${({ theme }) => theme.color.surfaceMuted} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`
