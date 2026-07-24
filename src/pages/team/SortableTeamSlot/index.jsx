import { TeamCard } from '../TeamCard'
import { useSortableTeamSlot } from './useSortableTeamSlot'
import { Wrapper } from './SortableTeamSlot.styles'

export const SortableTeamSlot = ({ id, name }) => {
  const { setNodeRef, attributes, listeners, style, isDragging } = useSortableTeamSlot({
    id,
  })

  return (
    <Wrapper
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      {...attributes}
      {...listeners}
    >
      <TeamCard id={id} name={name} />
    </Wrapper>
  )
}
