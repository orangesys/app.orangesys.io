/** @jsx jsx */
import { jsx } from '@emotion/core'
import { RouteComponentProps, Location, Redirect } from '@reach/router'

import { routes } from 'routes'

export const DashBoard = (props: RouteComponentProps<{ children: any }>) => {
  return <Location>{({ location }) => <Redirect to={routes.DashBoardPlan} noThrow></Redirect>}</Location>
}

export default DashBoard
