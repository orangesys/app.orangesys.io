import React, { createContext, FunctionComponent, useState, useEffect } from 'react'
import { UserService } from 'modules/user/user-service'
import User from 'modules/user/user'
import { Loading } from 'components/Loading'

const initialViewer = {
  viewer: undefined,
  setViewer: () => {},
}

type Context = {
  viewer: User | undefined
  setViewer: (user: User) => void
}

export const ViewerContext = createContext<Context>(initialViewer)

export const ViewerProvider: FunctionComponent = props => {
  const [viewer, setViewer] = useState()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const userService = new UserService()
    userService.fetchUser().then(user => {
      setViewer(user)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <ViewerContext.Provider
      value={{
        viewer,
        setViewer,
      }}
    >
      {loading ? <div>loading</div> : props.children}
    </ViewerContext.Provider>
  )
}
