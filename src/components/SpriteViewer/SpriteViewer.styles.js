import styled from 'styled-components'

export const Viewer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export const ImageFrame = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
`

export const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.space(1)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    justify-content: flex-start;
  }
`

export const Tab = styled.button`
  padding: ${({ theme }) => theme.space(1)} ${({ theme }) => theme.space(2)};
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ $isActive, theme }) =>
    $isActive ? theme.color.primary : theme.color.surfaceMuted};
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.color.onBackground : theme.color.textMuted};
  font-size: 0.7rem;
  font-weight: 700;
  white-space: nowrap;
`
