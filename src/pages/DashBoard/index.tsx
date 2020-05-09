/** @jsx jsx */
import { useContext } from 'react'
import { jsx } from '@emotion/core'
import { RouteComponentProps, Redirect, Location } from '@reach/router'

import { routes } from 'routes'
import { ViewerContext } from 'contexts/Viewer'

export const DashBoard = (props: RouteComponentProps) => {
  const { viewer } = useContext(ViewerContext)

  if (!viewer?.db) {
    return <Location>{({ location }) => <Redirect from={location.pathname} to={routes.BaseInfo} noThrow />}</Location>
  }

  if (!viewer?.planSelected) {
    return <Location>{({ location }) => <Redirect from={location.pathname} to={routes.OrderPlan} noThrow />}</Location>
  }

  if (!viewer?.serverSetupCompleted) {
    return (
      <Location>{({ location }) => <Redirect from={location.pathname} to={routes.ServerSetup} noThrow />}</Location>
    )
  }

  return (
    <Location>{({ location }) => <Redirect from={location.pathname} to={routes.DashBoardPlan} noThrow />}</Location>
  )
}

export default DashBoard
