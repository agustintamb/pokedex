import styled, { css } from 'styled-components'

const variants = {
  primary: css`
    min-width: 80px;
    padding: ${({ theme }) => theme.space(3)} ${({ theme }) => theme.space(4)};
    border: 2px solid ${({ theme }) => theme.color.border};
    background: ${({ theme }) => theme.color.primary};
    color: #fff;
  `,
  secondary: css`
    min-width: 80px;
    padding: ${({ theme }) => theme.space(3)} ${({ theme }) => theme.space(4)};
    border: 2px solid ${({ theme }) => theme.color.border};
    background: ${({ theme }) => theme.color.surface};
    color: ${({ theme }) => theme.color.textPrimary};
  `,
  muted: css`
    padding: ${({ theme }) => theme.space(2)} ${({ theme }) => theme.space(3)};
    border: none;
    background: ${({ theme }) => theme.color.surfaceMuted};
    color: ${({ theme }) => theme.color.textPrimary};
  `,
  link: css`
    display: inline-flex;
    padding: 0;
    border: none;
    background: none;
    color: ${({ theme }) => theme.color.textMuted};
    text-decoration: underline;
    text-underline-offset: 3px;

    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.color.textPrimary};
    }
  `,
}

export const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(1)};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.85rem;
  font-weight: 700;
  ${({ $variant }) => variants[$variant]}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`
