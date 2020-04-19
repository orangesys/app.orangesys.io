import React from 'react'
import { Typography, Paper } from '@material-ui/core'

import * as styles from './style'

type Props = {
  index: number
  value: number
  children: React.ReactNode
}

export function TabPanel(props: Props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Paper css={styles.whole}>{children}</Paper>}
    </Typography>
  )
}
