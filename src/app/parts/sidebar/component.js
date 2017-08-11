// @flow
import React, { Component } from 'react'
import ServerIcon from 'material-ui/svg-icons/file/cloud'
import PlanIcon from 'material-ui/svg-icons/action/work'
import GrafanaIcon from 'material-ui/svg-icons/action/assessment'
import InfluxDBIcon from 'material-ui/svg-icons/device/data-usage'
import InquiryIcon from 'material-ui/svg-icons/communication/contact-mail'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import LogoutIcon from 'material-ui/svg-icons/action/power-settings-new'

import MenuItem from './menu-item'
import Actions from './actions'
import { User } from '../../../core'
import { RouterOperation } from '../../../lib/router'
import logoImage from '../../../images/logo@3x.png'
import styles from './style.css'

type Props = {
  actions: Actions,
  className: string,
  currentPath: string,
  user: User,
}

type Menu = {
  id: string,
  text: string,
  icon: any,
  path: string,
}

const MENU_DATA: Array<Menu> = [
  { id: 'server', text: 'Server', icon: ServerIcon, path: '/server-settings' },
  { id: 'plan', text: 'Plan', icon: PlanIcon, path: '/plan' },
  { id: 'graph', text: 'Graph', icon: GrafanaIcon, path: '/graph' },
  { id: 'db', text: 'InfluxDB', icon: InfluxDBIcon, path: '/db' },
  { id: 'settings', text: 'Settings', icon: SettingsIcon, path: '/settings' },
  { id: 'inquiry', text: 'Inquiry', icon: InquiryIcon, path: '/inquiry' },
]

export default class Sidebar extends Component<void, Props, void> {
  props: Props

  onClickMenu(path: string) {
    RouterOperation.redirectTo(path)
  }

  get menuData(): Array<Menu> {
    const { user } = this.props
    if (!user.emailVerified || user.planId == null) {
      return []
    }
    if (!user.serverSetupCompleted) {
      return MENU_DATA.filter(menu => ['server', 'inquiry'].includes(menu.id))
    }
    return MENU_DATA.filter(menu => menu.id !== 'server')
  }

  get logoutClassName(): ?string {
    return this.menuData.length > 0 ? styles.logout : styles['logout-if-no-menu']
  }

  logout = () => {
    this.props.actions.signOut()
  }

  render() {
    const { currentPath } = this.props
    return (
      <nav className={`${styles.whole} ${this.props.className}`}>
        <div className={styles.logo}>
          <img src={logoImage} alt="OrangeSys Logo" width={36} height={36} />
        </div>
        <div>
          {this.menuData.map(record => (
            <MenuItem
              key={`sidebar-menu-item-${record.text}`}
              text={record.text}
              Icon={record.icon}
              active={new RegExp(record.path).test(currentPath)}
              onClick={() => { this.onClickMenu(record.path) }}
            />
          ))}
        </div>
        <div className={this.logoutClassName}>
          <MenuItem
            text="Logout"
            Icon={LogoutIcon}
            onClick={this.logout}
          />
        </div>
      </nav>
    )
  }
}
