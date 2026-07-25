import { Spinner } from '@/components/Spinner'
import { StyledButton } from './Button.styles'

export const Button = ({
  variant = 'primary',
  isLoading = false,
  disabled = false,
  children,
  ...rest
}) => (
  <StyledButton
    $variant={variant}
    disabled={disabled || isLoading}
    aria-busy={isLoading || undefined}
    {...rest}
  >
    {isLoading ? <Spinner size="16px" /> : children}
  </StyledButton>
)
