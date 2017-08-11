// @flow
import React from 'react'
import styles from './style.css'
import cssProps from '../../../variables.css'

type Props = {
  Icon: any,
  active?: boolean,
  hide?: boolean,
  text: string,
  onClick?: (e: SyntheticInputEvent) => void,
}

const MenuItem = (props: Props) => {
  const { Icon, hide, active, text } = props
  const iconStyle = { width: 28, height: 28 }
  const iconColor = active ? cssProps['--colorAccent2'] : cssProps['--colorWhite']
  const menuClasses = [styles.item]
  if (hide) { menuClasses.push(styles.hidden) }
  if (active) { menuClasses.push(styles.active) }
  const menuClass = menuClasses.join(' ')
  return (
    <div role="menuitem" tabIndex={0} className={menuClass} onClick={props.onClick}>
      <Icon className={styles.icon} style={iconStyle} color={iconColor} />
      <div className={styles.title}>{text}</div>
    </div>
  )
}
export default MenuItem

MenuItem.defaultProps = {
  active: false,
  hide: false,
  className: null,
  onClick: () => {},
}
