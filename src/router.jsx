import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PokedexPage } from '@/pages/pokedex'
import { DetailPage } from '@/pages/detail'
import { TeamPage } from '@/pages/team'
import { VersusPage } from '@/pages/versus'

// Lazy: trae lottie-web (pesado) solo si alguien pisa una ruta rota, no en el bundle principal
const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((module) => ({ default: module.NotFoundPage })),
)

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<PokedexPage />} />
    <Route path="/pokemon/:name" element={<DetailPage />} />
    <Route path="/team" element={<TeamPage />} />
    <Route path="/versus" element={<VersusPage />} />
    <Route
      path="/404"
      element={
        <Suspense fallback={null}>
          <NotFoundPage />
        </Suspense>
      }
    />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>
)
