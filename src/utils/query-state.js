export const getIsRetrying = ({ isLoading, isFetching, hasData }) =>
  Boolean(isFetching) && !isLoading && !hasData
