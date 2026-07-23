import Lottie from 'lottie-react'
import diglettAnimation from '@/assets/diglett.json'
import { EmptyState } from '@/components/EmptyState'
import { Page, ScreenPanel, AnimationFrame, HomeLink } from './index.styles'

export const NotFoundPage = () => (
  <Page>
    <ScreenPanel>
      <EmptyState
        illustration={
          <AnimationFrame>
            <Lottie animationData={diglettAnimation} loop style={{ height: '100%' }} />
          </AnimationFrame>
        }
        message="This page doesn't exist."
      />
      <HomeLink to="/">Back to the Pokédex</HomeLink>
    </ScreenPanel>
  </Page>
)
