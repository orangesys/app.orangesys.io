// @flow
import React from 'react'
import { CircularProgress } from 'material-ui'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { HeaderUnauth } from '..'
import theme from '../../theme'
import styles from './style.css'
import css from '../../../variables.css'

const AppLoader = () => (
  <MuiThemeProvider muiTheme={theme}>
    <div>
      <HeaderUnauth />
      <div className={styles.whole}>
        <div className={styles.loader}>
          <CircularProgress size={100} thickness={5} color={css['--colorPrimary1']} />
        </div>
      </div>
    </div>
  </MuiThemeProvider>
)

export default AppLoader
