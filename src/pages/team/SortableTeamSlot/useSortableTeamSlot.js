import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export const useSortableTeamSlot = ({ id }) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id,
    })

  return {
    setNodeRef,
    attributes,
    listeners,
    style: { transform: CSS.Transform.toString(transform), transition },
    isDragging,
  }
}
