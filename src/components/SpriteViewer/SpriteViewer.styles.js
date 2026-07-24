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
