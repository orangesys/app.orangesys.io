/** @jsx jsx */
import { useContext } from 'react'
import { jsx } from '@emotion/core'
import { RouteComponentProps, Location, Redirect } from '@reach/router'

import { routes } from 'routes'
import { ViewerContext } from 'contexts/Viewer'

export const Guarder = (props: RouteComponentProps<{ children: any }>) => {
  const { viewer } = useContext(ViewerContext)

  if (!viewer?.db) {
    return <Location>{({ location }) => <Redirect to={routes.BaseInfo} noThrow />}</Location>
  }

  if (viewer?.needVerifyEmail) {
    return <Location>{({ location }) => <Redirect to={routes.VerificationGuide} noThrow />}</Location>
  }

  if (!viewer?.planSelected) {
    return <Location>{({ location }) => <Redirect to={routes.OrderPlan} noThrow />}</Location>
  }

  return <Location>{({ location }) => props.children}</Location>
}
