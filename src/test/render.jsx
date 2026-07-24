import { render as rtlRender } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'

const withTheme = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

const customRender = (ui, options) => rtlRender(ui, { wrapper: withTheme, ...options })

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'
export { customRender as render }
