import styled from 'styled-components'
import {
  deviceScreen,
  deviceScreenHeight,
  deviceScreenFill,
  PageContainer,
} from '@/styles/page'

export const Page = styled(PageContainer)`
  ${deviceScreenHeight}
`

export const ScreenPanel = styled.div`
  ${deviceScreen}
  ${deviceScreenFill}
`
