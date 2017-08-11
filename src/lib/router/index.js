// @flow
// import type { ReactClass } from 'react'
import { Component } from 'react'
import RouterOperation from './operation'

export { RouterOperation }

export type UserStatus = Object

export type RouterProp = {
  path: ?string,
  query: { [key: string]: string },
  redirectTo: (path: string) => void,
}

type Route = {
  title?: ?string,
  TargetComponent: any,
  accessible: boolean | (status: UserStatus) => boolean,
  redirectPathIfDenied?: ?string | (status: UserStatus) => ?string,
}

type JudgeResult = {
  accessible: boolean,
  redirectPath: ?string,
  title: ?string,
  TargetComponent: ?(typeof Component),
}

export default class Router {
  routes: { [key: string]: Route }
  routes = {}

  add(path: string, route: Route): void {
    this.routes[path] = route
  }

  judge(path: string, userStatus: UserStatus): JudgeResult {
    const route = this.routes[path]
    if (route == null) { throw new Error(`route for ${path} is not found`) }
    let accessible: boolean
    if (typeof route.accessible === 'boolean') {
      accessible = route.accessible
    }
    if (typeof route.accessible === 'function') {
      accessible = route.accessible(userStatus)
    }
    if (accessible) {
      return {
        title: route.title,
        accessible,
        redirectPath: null,
        TargetComponent: route.TargetComponent,
      }
    }
    accessible = false
    let redirectPath
    if (typeof route.redirectPathIfDenied === 'string') {
      redirectPath = route.redirectPathIfDenied
    }
    if (typeof route.redirectPathIfDenied === 'function') {
      redirectPath = route.redirectPathIfDenied(userStatus)
    }
    const result: any = {
      title: null,
      accessible,
      redirectPath,
      TargetComponent: null,
    }
    return result
  }
}
