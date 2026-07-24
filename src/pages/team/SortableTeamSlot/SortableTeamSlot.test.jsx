import { describe, it, expect } from 'vitest'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { renderWithProviders, screen } from '@/test/render'
import { SortableTeamSlot } from './index'

const preloadedState = { favorites: { entries: [{ id: 25, name: 'pikachu' }] } }

// Smoke test de la composición (wrapper sorteable + TeamCard), no de la física del drag —
// eso necesitaría simular gestos de pointer reales, ver AGENTS.md "Testing"
describe('SortableTeamSlot', () => {
  it('renders the wrapped TeamCard inside a DndContext/SortableContext', () => {
    renderWithProviders(
      <DndContext>
        <SortableContext items={[25]}>
          <SortableTeamSlot id={25} name="pikachu" />
        </SortableContext>
      </DndContext>,
      { preloadedState },
    )

    expect(screen.getByRole('link', { name: 'pikachu' })).toHaveAttribute(
      'href',
      '/pokemon/pikachu',
    )
  })
})
