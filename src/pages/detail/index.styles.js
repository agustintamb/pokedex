import styled from 'styled-components'
import {
  PageContainer,
  deviceScreen,
  deviceScreenHeight,
  deviceScreenFill,
} from '@/styles/page'

export { ErrorState, RetryButton } from '@/styles/page'

export const Page = styled(PageContainer)`
  padding: 0;
  background: ${({ theme }) => theme.color.surfaceSection};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    background: ${({ theme }) => theme.color.background};
  }

  ${deviceScreenHeight}
`

export const Content = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.color.surfaceSection};
  padding: ${({ theme }) => theme.space(4)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    ${deviceScreen}
    padding-bottom: ${({ theme }) => theme.space(9)};
  }

  ${deviceScreenFill}
`

// Agrupa NameTitle + Layout para poder centrarlos como un solo bloque dentro de Content
// (que ahora tiene alto fijo desde md, ver deviceScreenHeight/deviceScreenFill) — `margin:
// auto` en vez de `justify-content: center` en el padre: centrar con justify-content en un
// contenedor flex que puede scrollear deja la parte de arriba del contenido inalcanzable
// si el contenido termina siendo más alto que el marco (el scroll no puede llegar a
// posiciones "negativas"). Con margin:auto en el hijo, si no sobra espacio el margen
// colapsa a 0 solo, sin ese problema — mismo criterio que EmptyState (Wrapper con
// margin:auto dentro de un padre flex-column)
export const ContentBody = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    width: 100%;
    margin: auto 0;
  }
`

export const DexNumber = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.space(7)};
  right: ${({ theme }) => theme.space(4)};
  font-family: ${({ theme }) => theme.font.mono};
  color: ${({ theme }) => theme.color.textFaint};
`

// Mobile: flotante (fixed al viewport, no a Content) — siempre visible, no se va con el
// scroll. A partir de md vuelve a position:absolute anclado a Content.
export const FavoriteSlot = styled.div`
  position: fixed;
  right: ${({ theme }) => theme.space(4)};
  bottom: ${({ theme }) => theme.space(5)};
  z-index: 15;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    position: absolute;
    bottom: ${({ theme }) => theme.space(3)};
  }
`

export const Layout = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    flex-direction: row;
    align-items: flex-start;
    padding: 0 ${({ theme }) => theme.space(6)};
    gap: ${({ theme }) => theme.space(6)};
  }
`

export const LeftColumn = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    flex: 0 0 auto;
    width: 460px;
  }
`

export const RightColumn = styled.div`
  min-width: 0;
  margin-bottom: ${({ theme }) => theme.space(16)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    margin-bottom: unset;
    margin-top: ${({ theme }) => theme.space(20)};
    flex: 1;
    display: flex;
    flex: 1 1 0%;
    gap: 16px;
    flex-direction: column;
  }
`

export const NameTitle = styled.h1`
  text-align: center;
  font-weight: 700;
  text-transform: capitalize;
  color: ${({ theme }) => theme.color.textPrimary};
  margin-bottom: ${({ theme }) => theme.space(3)};
`

export const Stage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(6)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    align-items: flex-start;
  }
`

export const ArtworkFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: auto;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ArtworkImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`

export const ShinyToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
  margin: auto;
`

export const ShinyToggleLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.color.textMuted};
`

export const TypesRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(2)};
`

export const TypesLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.color.textMuted};
`

export const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.space(4)};
`

export const SectionTitle = styled.h2`
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.color.textMuted};
  margin-bottom: ${({ theme }) => theme.space(2)};
`

export const SectionToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.color.textMuted};
  background: none;
  border: none;
  padding: 0;
  margin-bottom: ${({ theme }) => theme.space(2)};
`

export const ToggleIcon = styled.span`
  display: inline-block;
  transition: transform 0.2s ease;
  transform: rotate(${({ $isOpen }) => ($isOpen ? '0deg' : '-90deg')});
`

export const MeasurementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(1)};
`

export const MeasurementRow = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.textPrimary};
`

export const MeasurementLabel = styled.span`
  color: ${({ theme }) => theme.color.textMuted};
  margin-right: ${({ theme }) => theme.space(1)};
`

export const AbilitiesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(1)};
`

export const AbilityItem = styled.li`
  color: ${({ theme }) => theme.color.textPrimary};
  text-transform: capitalize;
`

export const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`
