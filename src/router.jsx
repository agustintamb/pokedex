import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Spinner } from '@/components/Spinner'
import { PageShell, CenteredScreen } from '@/styles/page'
import { PokedexPage } from '@/pages/pokedex'

// La Home entra en el bundle inicial (es la landing); el resto se parte en chunks aparte
// para que recharts, dnd-kit, lottie y formik no viajen en la primera carga.
const DetailPage = lazy(() =>
  import('@/pages/detail').then((module) => ({ default: module.DetailPage })),
)
const TeamPage = lazy(() =>
  import('@/pages/team').then((module) => ({ default: module.TeamPage })),
)
const VersusPage = lazy(() =>
  import('@/pages/versus').then((module) => ({ default: module.VersusPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((module) => ({ default: module.NotFoundPage })),
)

const RouteFallback = () => (
  <PageShell>
    <CenteredScreen>
      <Spinner size="52px" label="Loading" />
    </CenteredScreen>
  </PageShell>
)

export const AppRouter = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route path="/" element={<PokedexPage />} />
      <Route path="/pokemon/:name" element={<DetailPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/versus" element={<VersusPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  </Suspense>
)
