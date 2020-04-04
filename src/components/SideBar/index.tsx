/** @jsx jsx */
import { jsx } from '@emotion/core'

import ServerIcon from '@material-ui/icons/Cloud'
import PlanIcon from '@material-ui/icons/Work'
import GrafanaIcon from '@material-ui/icons/Assessment'
import TSDBIcon from '@material-ui/icons/DataUsage'
import InquiryIcon from '@material-ui/icons/ContactMail'
import SettingsIcon from '@material-ui/icons/Settings'
import LogoutIcon from '@material-ui/icons/PowerSettingsNew'
import { MenuList, MenuItem } from '@material-ui/core'

import logoImage from 'images/logo@3x.png'

import { MenuItem as Item } from 'components/MenuItem'
import { navigate } from '@reach/router'

import * as styles from './style'
import { UserService } from 'modules/user/user-service'
import { ViewerContext } from 'contexts/Viewer'
import { useContext } from 'react'
import User from 'modules/user/user'
import { routes } from 'routes'

export const SideBar = () => {
  const { setViewer } = useContext(ViewerContext)

  const signOut = async () => {
    const userService = new UserService()
    await userService.signOut()
    setViewer(new User())
  }

  const MENUS = [
    { id: 'server', text: 'Server', icon: ServerIcon, path: routes.ServerSetup },
    { id: 'plan', text: 'Plan', icon: PlanIcon, path: routes.DashBoardPlan },
    { id: 'graph', text: 'Graph', icon: GrafanaIcon, path: routes.DashBoardGraph },
    { id: 'db', text: 'TSDB', icon: TSDBIcon, path: routes.DashBoardDB },
    { id: 'settings', text: 'Settings', icon: SettingsIcon, path: routes.Settings },
    { id: 'inquiry', text: 'Inquiry', icon: InquiryIcon, path: routes.DashBoardInquiry },
  ]

  return (
    <div css={styles.whole}>
      <div css={styles.logo}>
        <img src={logoImage} alt="OrangeSys Logo" width={36} height={36} />
      </div>
      <MenuList>
        {MENUS.map(item => (
          <MenuItem key={item.id} onClick={() => navigate(item.path)}>
            <Item Icon={item.icon} label={item.text} />
          </MenuItem>
        ))}
        <MenuItem onClick={signOut}>
          <Item Icon={LogoutIcon} label="Logout" />
        </MenuItem>
      </MenuList>
    </div>
  )
}

export default SideBar
