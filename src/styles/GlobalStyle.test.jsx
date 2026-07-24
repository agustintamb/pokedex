import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet, ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'
import { GlobalStyle } from './GlobalStyle'

// jsdom no expone el <style>/stylesheet que createGlobalStyle inyecta client-side (ni en
// document.head/document.styleSheets ni en document.adoptedStyleSheets — investigado en un
// spike descartado, ver AGENTS.md). `ServerStyleSheet` es el mecanismo real de
// styled-components para SSR (no un mock): renderiza el árbol a string y expone el CSS
// final ya interpolado con el theme, así que esto testea las reglas/valores reales que
// GlobalStyle produce, no un estilo computado de un elemento.
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
    // El CSS final viene minificado (sin espacios después de las comas) — se compara
    // contra el mismo valor del theme "compactado" en vez de asumir el formato exacto.
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
