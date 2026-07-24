import styled from 'styled-components'

export const Wrapper = styled.div`
  touch-action: none;
  cursor: grab;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};

  &:active {
    cursor: grabbing;
  }
`
