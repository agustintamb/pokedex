import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, act } from '@/test/render'
import { ConnectionStatus } from './index'

const setOnLine = (value) =>
  Object.defineProperty(navigator, 'onLine', { value, configurable: true })

describe('ConnectionStatus', () => {
  afterEach(() => setOnLine(true))

  it('shows a live status when the browser is online', () => {
    setOnLine(true)
    render(<ConnectionStatus />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Online')
    expect(status).toHaveAttribute('title', 'Live data')
  })

  it('shows an offline/cached status when the browser is offline', () => {
    setOnLine(false)
    render(<ConnectionStatus />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Offline')
    expect(status).toHaveTextContent('cached')
    expect(status).toHaveAttribute('title', 'Showing saved (cached) data')
  })

  it('reacts to the browser going offline', () => {
    setOnLine(true)
    render(<ConnectionStatus />)
    expect(screen.getByRole('status')).toHaveTextContent('Online')

    act(() => {
      setOnLine(false)
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.getByRole('status')).toHaveTextContent('Offline')
  })
})
