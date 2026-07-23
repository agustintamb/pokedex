import { Wrapper, EmptyStateTitle, Message } from './EmptyState.styles'

export const EmptyState = ({ title, message, illustration }) => (
  <Wrapper>
    {illustration ?? <EmptyStateTitle>{title ?? '404'}</EmptyStateTitle>}
    <Message>{message ?? 'Not found'}</Message>
  </Wrapper>
)
