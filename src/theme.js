import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#FD8551',
      main: '#F3522C',
      dark: '#E0E0E0',
    },
    secondary: {
      light: '#FEE563',
      main: '#F9A825',
      dark: '#E0E0E0',
    },
    error: {
      light: 'rgb(250, 100, 100)',
      main: 'rgb(200, 0, 0)',
    },
  },
  status: {
    danger: 'orange',
  },
})
