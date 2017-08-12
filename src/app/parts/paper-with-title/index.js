// @flow

import React from 'react'
import { Paper } from 'material-ui'
import styles from './styles.css'

type Props = {
  children?: any,
  title: string,
}

const PaperWithTitle = (props: Props) => (
  <Paper className={styles.whole}>
    <div className={styles.title}>{props.title}</div>
    {props.children}
  </Paper>
)

PaperWithTitle.defaultProps = {
  children: null,
}

export default PaperWithTitle
