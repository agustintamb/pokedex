import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, fireEvent } from '@/test/render'
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
    // { hidden: true }: OptionsList es display:none hasta md a propósito y jsdom no simula media
    // queries — importa qué opciones renderiza, no en qué breakpoint se ven.
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

  it('calls onDismiss when clicking outside while options are shown', () => {
    const handleDismiss = vi.fn()
    render(
      <div>
        <SearchSelect
          value="pika"
          onChange={vi.fn()}
          options={['pikachu']}
          onSelectOption={vi.fn()}
          onDismiss={handleDismiss}
        />
        <button type="button">outside</button>
      </div>,
    )

    fireEvent.mouseDown(screen.getByText('outside'))

    expect(handleDismiss).toHaveBeenCalled()
  })

  it('does not call onDismiss when clicking inside the options list', () => {
    const handleDismiss = vi.fn()
    render(
      <SearchSelect
        value="pika"
        onChange={vi.fn()}
        options={['pikachu']}
        onSelectOption={vi.fn()}
        onDismiss={handleDismiss}
      />,
    )

    fireEvent.mouseDown(screen.getByRole('button', { name: 'pikachu', hidden: true }))

    expect(handleDismiss).not.toHaveBeenCalled()
  })

  it('does not attach an outside-click listener when there are no options to dismiss', () => {
    const handleDismiss = vi.fn()
    render(
      <div>
        <SearchSelect
          value=""
          onChange={vi.fn()}
          options={[]}
          onSelectOption={vi.fn()}
          onDismiss={handleDismiss}
        />
        <button type="button">outside</button>
      </div>,
    )

    fireEvent.mouseDown(screen.getByText('outside'))

    expect(handleDismiss).not.toHaveBeenCalled()
  })

  it('does not crash on an outside click or a focus when onDismiss/onFocus are not given', () => {
    render(
      <div>
        <SearchSelect
          value="pika"
          onChange={vi.fn()}
          options={['pikachu']}
          onSelectOption={vi.fn()}
          placeholder="Search"
        />
        <button type="button">outside</button>
      </div>,
    )

    fireEvent.mouseDown(screen.getByText('outside'))
    fireEvent.focus(screen.getByPlaceholderText('Search'))

    expect(
      screen.getByRole('button', { name: 'pikachu', hidden: true }),
    ).toBeInTheDocument()
  })

  it('calls onFocus when the input is focused', () => {
    const handleFocus = vi.fn()
    render(
      <SearchSelect
        value="pika"
        onChange={vi.fn()}
        options={[]}
        onSelectOption={vi.fn()}
        onFocus={handleFocus}
        placeholder="Search"
      />,
    )

    fireEvent.focus(screen.getByPlaceholderText('Search'))

    expect(handleFocus).toHaveBeenCalled()
  })
})
