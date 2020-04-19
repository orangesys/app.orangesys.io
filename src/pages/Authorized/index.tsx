import React, { useContext } from 'react'
import { Location, Redirect, RouteComponentProps } from '@reach/router'
import { routes, routeTitles } from '../../routes'

import { MainLayout } from 'components/Layout/MainLayout'
import { ViewerContext } from 'contexts/Viewer'

export const Authorized = (props: RouteComponentProps<{ children: any }>) => {
  const { viewer } = useContext(ViewerContext)

  const { loggedIn } = viewer || {}
  if (!loggedIn) {
    return <Location>{({ location }) => <Redirect from={location.pathname} to={routes.SignIn} noThrow />}</Location>
  }
  return (
    <Location>
      {({ location }) => <MainLayout title={routeTitles[location.pathname]}>{props.children}</MainLayout>}
    </Location>
  )
}

export default Authorized
