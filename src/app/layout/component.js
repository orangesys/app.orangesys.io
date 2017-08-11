// @flow
import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import ActionDispatcher from './actions'
import theme from '../theme'
import { Message, ErrorMessage, HeaderUnauth, Sidebar } from '../parts'
import { User } from '../../core'
import styles from './style.css'

type Props = {
  children: Element,
  message: ?string,
  errorMessage: string,
  user: User,
  actions: ActionDispatcher,
  currentPath: string,
  currentTitle: ?string,
}

const Layout = (props: Props) => {
  const {
    children,
    message,
    errorMessage,
    actions,
    user,
    currentPath,
    currentTitle,
  } = props
  const loggedIn = user.authenticated

  if (!loggedIn) {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div>
          {!loggedIn && <HeaderUnauth />}
          {children}
          <Message
            message={message}
            onClose={() => actions.clearMessage()}
          />
          <ErrorMessage
            message={errorMessage}
            onClose={() => actions.clearError()}
          />
        </div>
      </MuiThemeProvider>
    )
  }
  return (
    <MuiThemeProvider muiTheme={theme}>
      <div className={styles.whole}>
        <Sidebar className={styles.sidebar} currentPath={currentPath} />
        <div className={styles.main}>
          <header className={styles.header}>
            <div className={styles['app-name']}>Orangesys.io</div>
            <div className={styles.seperator}>&gt;&gt;</div>
            <div>{currentTitle}</div>
          </header>
          <div className={styles.content}>
            {children}
          </div>
        </div>
        <Message
          message={message}
          onClose={() => actions.clearMessage()}
        />
        <ErrorMessage
          message={errorMessage}
          onClose={() => actions.clearError()}
        />
      </div>
    </MuiThemeProvider>
  )
}

export default Layout
