import React from 'react'

import { Routes } from './routes'
import { ThemeProvider } from '@material-ui/core'
import { theme } from './theme'
import { ViewerProvider } from 'contexts/Viewer'

import './App.css'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ViewerProvider>
        <Routes />
      </ViewerProvider>
    </ThemeProvider>
  )
}

export default App
