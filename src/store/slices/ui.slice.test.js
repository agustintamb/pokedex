import { describe, it, expect } from 'vitest'
import { uiReducer, showSnackbar, dismissSnackbar, selectSnackbars } from './ui.slice'

const buildState = (snackbars = []) => ({ snackbars })

describe('showSnackbar', () => {
  it('pushes a snackbar with a generated id', () => {
    const state = uiReducer(
      buildState(),
      showSnackbar({ variant: 'success', message: 'Added!' }),
    )
    expect(state.snackbars).toHaveLength(1)
    expect(state.snackbars[0]).toMatchObject({ variant: 'success', message: 'Added!' })
    expect(state.snackbars[0].id).toEqual(expect.any(String))
  })

  it('assigns a different id to each snackbar', () => {
    let state = uiReducer(buildState(), showSnackbar({ variant: 'info', message: 'One' }))
    state = uiReducer(state, showSnackbar({ variant: 'info', message: 'Two' }))
    expect(state.snackbars).toHaveLength(2)
    expect(state.snackbars[0].id).not.toBe(state.snackbars[1].id)
  })
})

describe('dismissSnackbar', () => {
  it('removes the snackbar with the matching id', () => {
    const state = uiReducer(
      buildState([
        { id: 'a', variant: 'info', message: 'One' },
        { id: 'b', variant: 'info', message: 'Two' },
      ]),
      dismissSnackbar('a'),
    )
    expect(state.snackbars).toEqual([{ id: 'b', variant: 'info', message: 'Two' }])
  })

  it('is a no-op when the id is not present', () => {
    const initial = buildState([{ id: 'a', variant: 'info', message: 'One' }])
    const state = uiReducer(initial, dismissSnackbar('missing'))
    expect(state.snackbars).toEqual(initial.snackbars)
  })
})

describe('selectSnackbars', () => {
  it('returns the snackbars array', () => {
    const snackbars = [{ id: 'a', variant: 'info', message: 'One' }]
    expect(selectSnackbars({ ui: buildState(snackbars) })).toBe(snackbars)
  })
})
