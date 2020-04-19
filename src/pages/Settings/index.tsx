/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Tabs, Tab, AppBar } from '@material-ui/core'
import { RouteComponentProps } from '@reach/router'
import { useState } from 'react'

import { layoutOffset, layoutMain, MainStyle } from 'styles/layout-center'
import { TabPanel } from 'components/TabPanel'

import { AccountSetting } from './account'
import { PaymentSetting } from './payment'

export default function Settings(props: RouteComponentProps) {
  const [tabIndex, setTabIndex] = useState(0)
  const handleChange = (_: any, newValue: number) => {
    setTabIndex(newValue)
  }

  return (
    <div css={MainStyle}>
      <div css={layoutOffset}></div>
      <div css={layoutMain}>
        <AppBar position="static">
          <Tabs value={tabIndex} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="アカウント設定"></Tab>
            <Tab label="支払い方法"></Tab>
          </Tabs>
        </AppBar>
        <TabPanel value={tabIndex} index={0}>
          <AccountSetting />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <PaymentSetting />
        </TabPanel>
      </div>

      <div css={layoutOffset}></div>
    </div>
  )
}
