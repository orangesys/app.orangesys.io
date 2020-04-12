import React from 'react'
import { ThemeProvider } from '@material-ui/core'

import { Routes } from './routes'
import { theme } from './theme'
import { ViewerProvider } from 'contexts/Viewer'
import { GlobalMessageProvider } from 'contexts/GlobalMessage'
import { GlobalMessage } from 'components/GlobalMessage'
import './App.css'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalMessageProvider>
        <ViewerProvider>
          <Routes />
        </ViewerProvider>
        <GlobalMessage />
      </GlobalMessageProvider>
    </ThemeProvider>
  )
}

export default App
