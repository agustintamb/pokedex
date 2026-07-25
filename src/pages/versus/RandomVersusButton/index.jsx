import Lottie from 'lottie-react'
import { Tooltip } from '@/components/Tooltip'
import pokeballAnimation from '@/assets/animations/pokeball.json'
import { Button } from './RandomVersusButton.styles'

export const RandomVersusButton = ({ onClick }) => (
  <Tooltip label="Generate random versus" position="top">
    <Button type="button" onClick={onClick} aria-label="Generate random versus">
      <Lottie
        animationData={pokeballAnimation}
        loop
        style={{ width: '100%', height: '100%' }}
      />
    </Button>
  </Tooltip>
)
