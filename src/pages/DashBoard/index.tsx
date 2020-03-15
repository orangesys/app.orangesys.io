/** @jsx jsx */
import { jsx } from '@emotion/core'
import { RouteComponentProps, Redirect, Location } from '@reach/router'

import { routes } from 'routes'
import { ViewerContext } from 'contexts/Viewer'
import { useContext } from 'react'

export const DashBoard = (props: RouteComponentProps) => {
  const { viewer } = useContext(ViewerContext)
  const { emailVerified, planSelected, serverSetupCompleted } = viewer || {}
  if (!viewer?.db) {
    return <Location>{({ location }) => <Redirect from={location.pathname} to={routes.BaseInfo} noThrow />}</Location>
  }

  if (!emailVerified) {
    return (
      <Location>
        {({ location }) => <Redirect from={location.pathname} to={routes.VerificationGuide} noThrow />}
      </Location>
    )
  }
  if (!planSelected) {
    return <Location>{({ location }) => <Redirect from={location.pathname} to={routes.OrderPlan} noThrow />}</Location>
  }
  if (!serverSetupCompleted) {
    return (
      <Location>{({ location }) => <Redirect from={location.pathname} to={routes.ServerSetup} noThrow />}</Location>
    )
  }

  return (
    <Location>{({ location }) => <Redirect from={location.pathname} to={routes.DashBoardPlan} noThrow />}</Location>
  )
}
