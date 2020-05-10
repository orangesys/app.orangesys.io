import React, { useContext } from 'react'
import { Location, Redirect, RouteComponentProps } from '@reach/router'
import { routes, routeTitles } from '../../routes'

import { MainLayout } from 'components/Layout/MainLayout'
import { ViewerContext } from 'contexts/Viewer'

export const Authorized = (props: RouteComponentProps<{ children: any }>) => {
  const { viewer } = useContext(ViewerContext)

  if (!viewer?.loggedIn) {
    return <Redirect to={routes.SignIn} noThrow />
  }

  return (
    <Location>
      {({ location }) => <MainLayout title={routeTitles[location.pathname]}>{props.children}</MainLayout>}
    </Location>
  )
}

export default Authorized
