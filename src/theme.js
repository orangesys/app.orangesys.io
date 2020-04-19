import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#f6856b',
      main: '#f3522c',
      dark: '#be2d0a',
    },
    secondary: {
      light: '#fac266',
      main: '#f9a825',
      dark: '#c27a05',
    },
    error: {
      light: '#ff2525',
      main: '#c80000',
      dark: '#8b0000',
    },
  },
  status: {
    danger: 'orange',
  },
})
