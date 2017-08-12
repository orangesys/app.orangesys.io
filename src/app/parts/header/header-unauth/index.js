// @flow
import React from 'react'
import styles from './styles.css'
import logoImage from '../../../../images/logo@3x.png'

const HeaderUnauth = () => (
  <header className={styles.whole}>
    <div className={styles.bar} />
    <div className={styles.main}>
      <div className={styles.logo}>
        <img src={logoImage} alt="OrangeSys Logo" width={36} height={36} />
      </div>
      <div className={styles.title}>Orangesys</div>
    </div>
  </header>
)

export default HeaderUnauth
