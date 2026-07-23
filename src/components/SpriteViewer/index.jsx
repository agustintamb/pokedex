import { Viewer, ImageFrame, Image, Tabs, Tab } from './SpriteViewer.styles'

export const SpriteViewer = ({ sprites, selected, selectedKey, onSelect, alt }) => {
  if (!selected) return null

  return (
    <Viewer>
      <ImageFrame>
        <Image src={selected.src} alt={`${alt} ${selected.label}`} />
      </ImageFrame>
      <Tabs>
        {sprites.map(({ key, label }) => (
          <Tab
            key={key}
            type="button"
            $isActive={key === selectedKey}
            onClick={() => onSelect(key)}
          >
            {label}
          </Tab>
        ))}
      </Tabs>
    </Viewer>
  )
}
