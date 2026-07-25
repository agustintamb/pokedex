import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet, ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'
import { GlobalStyle } from './GlobalStyle'

// jsdom no expone el <style> que createGlobalStyle inyecta (ver AGENTS.md). ServerStyleSheet
// es el mecanismo real de styled-components para SSR: renderiza a string y expone el CSS ya
// interpolado con el theme, así que se testean las reglas reales, no un estilo computado.
const renderGlobalStyleCss = () => {
  const sheet = new ServerStyleSheet()
  renderToString(
    sheet.collectStyles(
      <ThemeProvider theme={theme}>
        <GlobalStyle />
      </ThemeProvider>,
    ),
  )
  const css = sheet.getStyleTags()
  sheet.seal()
  return css
}

describe('GlobalStyle', () => {
  it('resets box-sizing on every element', () => {
    expect(renderGlobalStyleCss()).toContain('box-sizing:border-box')
  })

  it('applies the theme background to html and body', () => {
    const css = renderGlobalStyleCss()
    const backgroundDeclaration = `background:${theme.color.background}`

    expect(css.match(new RegExp(backgroundDeclaration, 'g'))).toHaveLength(2)
  })

  it('applies the theme text color and font to body', () => {
    const css = renderGlobalStyleCss()

    expect(css).toContain(`color:${theme.color.textPrimary}`)
    // El CSS final viene minificado: se compara contra el valor del theme "compactado"
    expect(css).toContain(`font-family:${theme.font.body.replace(/,\s*/g, ',')}`)
  })

  it('uses the theme accent color for the focus-visible outline', () => {
    expect(renderGlobalStyleCss()).toContain(`outline:2px solid ${theme.color.accent}`)
  })

  it('disables animations under prefers-reduced-motion', () => {
    const css = renderGlobalStyleCss()

    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toContain('animation-duration:0.01ms!important')
  })
})
