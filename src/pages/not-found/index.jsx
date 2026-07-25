import Lottie from 'lottie-react'
import { Link } from 'react-router-dom'
import diglettAnimation from '@/assets/animations/diglett.json'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/Button'
import { Page, ScreenPanel, AnimationFrame } from './index.styles'

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
      <Button as={Link} to="/" variant="link">
        Back to the Pokédex
      </Button>
    </ScreenPanel>
  </Page>
)
