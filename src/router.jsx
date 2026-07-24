import { Navigate, Route, Routes } from 'react-router-dom'
import { PokedexPage } from '@/pages/pokedex'
import { DetailPage } from '@/pages/detail'
import { VersusPage } from '@/pages/versus'
import { TeamPage } from '@/pages/team'
import { NotFoundPage } from '@/pages/not-found'

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<PokedexPage />} />
    <Route path="/pokemon/:name" element={<DetailPage />} />
    <Route path="/team" element={<TeamPage />} />
    <Route path="/versus" element={<VersusPage />} />
    <Route path="/404" element={<NotFoundPage />} />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>
)
