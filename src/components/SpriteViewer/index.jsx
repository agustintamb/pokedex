import { Tab, Tabs } from '@/components/Tab'
import { Viewer, ImageFrame, Image } from './SpriteViewer.styles'

export const SpriteViewer = ({ sprites, selected, selectedKey, onSelect, alt }) => {
  if (!selected) return null

  return (
    <Viewer>
      <ImageFrame>
        <Image src={selected.src} alt={`${alt} ${selected.label}`} />
      </ImageFrame>
      <Tabs>
        {sprites.map(({ key, label }) => (
          <Tab key={key} isActive={key === selectedKey} onClick={() => onSelect(key)}>
            {label}
          </Tab>
        ))}
      </Tabs>
    </Viewer>
  )
}
