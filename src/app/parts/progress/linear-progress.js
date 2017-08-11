// @flow
import React from 'react'
import { LinearProgress } from 'material-ui'
import styles from './style.css'

type Props = {
  on?: boolean,
}

const Progress = (props: Props) => (
  <div className={styles.whole} style={{ visibility: props.on ? '' : 'hidden' }} >
    <LinearProgress />
  </div>
)

Progress.defaultProps = {
  on: true,
}

export default Progress
