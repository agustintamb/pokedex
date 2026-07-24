import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@/test/render'
import { SearchSelect } from './index'

describe('SearchSelect', () => {
  it('renders the label when provided', () => {
    render(
      <SearchSelect
        label="Name"
        value=""
        onChange={vi.fn()}
        options={[]}
        onSelectOption={vi.fn()}
      />,
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  it('does not render a label when none is given', () => {
    render(
      <SearchSelect value="" onChange={vi.fn()} options={[]} onSelectOption={vi.fn()} />,
    )
    expect(screen.queryByText('Name')).not.toBeInTheDocument()
  })

  it('calls onChange as the user types', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(
      <SearchSelect
        value=""
        onChange={handleChange}
        options={[]}
        onSelectOption={vi.fn()}
        placeholder="Search"
      />,
    )
    await user.type(screen.getByPlaceholderText('Search'), 'pika')
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders one option per entry and calls onSelectOption when clicked', async () => {
    // { hidden: true }: OptionsList es `display:none` hasta md por CSS (a propósito, ver
    // SearchSelect.styles.js) — jsdom no simula viewport/media queries de forma confiable,
    // así que se ignora la visibilidad calculada acá; lo que importa es que renderiza las
    // opciones correctas y dispara el handler, no en qué breakpoint se ven.
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    render(
      <SearchSelect
        value="pika"
        onChange={vi.fn()}
        options={['pikachu', 'pikipek']}
        onSelectOption={handleSelect}
      />,
    )
    expect(
      screen.getByRole('button', { name: 'pikachu', hidden: true }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'pikipek', hidden: true }))
    expect(handleSelect).toHaveBeenCalledWith('pikipek')
  })

  it('does not render an options list when there are no options', () => {
    render(
      <SearchSelect value="" onChange={vi.fn()} options={[]} onSelectOption={vi.fn()} />,
    )
    expect(screen.queryByRole('button', { hidden: true })).not.toBeInTheDocument()
  })
})
