import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space(6)};

  ${({ $fill }) =>
    $fill &&
    css`
      flex: 1;
      min-height: 0;
    `}
`
