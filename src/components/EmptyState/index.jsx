import { Wrapper, EmptyStateTitle, Message } from './EmptyState.styles'

export const EmptyState = ({ title = '∅', message, illustration }) => (
  <Wrapper>
    {illustration ?? <EmptyStateTitle>{title}</EmptyStateTitle>}
    <Message>{message}</Message>
  </Wrapper>
)
