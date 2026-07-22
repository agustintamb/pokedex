import { useEffect, useMemo, useRef, useState } from 'react'
import { useGetPokemonIndexQuery } from '@/api/pokeApi'

const PAGE_SIZE = 24

export const usePokedexPage = () => {
  const { data: index = [], isLoading, isError, refetch } = useGetPokemonIndexQuery()
  const [page, setPage] = useState(1)
  const sentinelRef = useRef(null)

  const entries = useMemo(() => index.slice(0, page * PAGE_SIZE), [index, page])
  const hasMore = entries.length < index.length

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPage((current) => current + 1)
      },
      { rootMargin: '400px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore])

  const handleRetry = () => refetch()

  return {
    entries,
    isLoading,
    isError,
    hasMore,
    sentinelRef,
    handleRetry,
  }
}
