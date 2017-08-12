// @flow

import React from 'react'
import { Tabs, Tab } from 'material-ui'
import AccountSetting from './account'
import PaymentSetting from './payment'
// import styles from './style.css'

/* eslint-disable */
const Settings = () => {
  return (
    <div>
      <Tabs>
        <Tab label="アカウント設定">
          <AccountSetting />
        </Tab>
        <Tab label="支払い方法">
          <PaymentSetting />
        </Tab>
        <Tab />
        <Tab />
      </Tabs>
    </div>
  )
}

/* eslint-enable */

export default Settings
