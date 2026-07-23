import { createGlobalStyle } from 'styled-components'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    color-scheme: light;
    background: ${({ theme }) => theme.color.background};
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.color.background};
    color: ${({ theme }) => theme.color.textPrimary};
    font-family: ${({ theme }) => theme.font.body};
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  h1, h2, h3, h4 {
    margin: 0;
    font-family: ${({ theme }) => theme.font.display};
    font-weight: 600;
  }

  p {
    margin: 0;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.accent};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`
