import styled from 'styled-components'
import { PageContainer, deviceScreen } from '@/styles/page'

export { ErrorState, RetryButton } from '@/styles/page'

export const Page = styled(PageContainer)`
  padding: 0;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

export const Content = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.color.surfaceSection};
  padding: ${({ theme }) => theme.space(4)};
  padding-bottom: ${({ theme }) => theme.space(8)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    min-height: auto;
    ${deviceScreen}
    padding-bottom: ${({ theme }) => theme.space(9)};
  }
`

export const DexNumber = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.space(4)};
  bottom: ${({ theme }) => theme.space(3)};
  font-family: ${({ theme }) => theme.font.mono};
  color: ${({ theme }) => theme.color.textFaint};
`

export const NameTitle = styled.h1`
  text-align: center;
  font-weight: 700;
  text-transform: capitalize;
  color: ${({ theme }) => theme.color.textPrimary};
  margin-bottom: ${({ theme }) => theme.space(3)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    text-align: left;
  }
`

export const Layout = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    flex-direction: row;
    align-items: flex-start;
    gap: ${({ theme }) => theme.space(6)};
  }
`

export const LeftColumn = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    flex: 0 0 auto;
    width: 360px;
  }
`

export const RightColumn = styled.div`
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    flex: 1;
  }
`

export const Stage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  margin-bottom: ${({ theme }) => theme.space(3)};

  @media (min-width: ${({ theme }) => theme.breakpoint.md}) {
    align-items: flex-start;
  }
`

export const ArtworkFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
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
  position: absolute;
  top: ${({ theme }) => theme.space(7)};
  right: ${({ theme }) => theme.space(4)};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
`

export const ShinyToggleLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.color.textMuted};
`

export const ShinyToggleButton = styled.button`
  position: relative;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ $isOn, theme }) => ($isOn ? theme.color.border : theme.color.textFaint)};
  padding: 0;
  transition: background 0.2s ease;
`

export const ShinyToggleThumb = styled.span`
  position: absolute;
  top: 2px;
  left: ${({ $isOn }) => ($isOn ? '20px' : '2px')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.surface};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  transition: left 0.2s ease;
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
