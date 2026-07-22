import { Route, Routes } from 'react-router-dom'
import { PokedexPage } from '@/pages/pokedex'
import { DetailPage } from '@/pages/detail'
import { TeamPage } from '@/pages/team'
import { VersusPage } from '@/pages/versus'

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<PokedexPage />} />
    <Route path="/pokemon/:name" element={<DetailPage />} />
    <Route path="/team" element={<TeamPage />} />
    <Route path="/versus" element={<VersusPage />} />
  </Routes>
)
