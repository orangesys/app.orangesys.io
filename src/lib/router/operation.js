// @flow
import queryString from 'query-string'

type Query = {
  [key: string]: string,
}

let routerOperation

export default class RouterOperation {
  window: any
  path: ?string
  query: ?Query
  constructor(window: any, path: ?string = null, query: ?Query = {}) {
    this.window = window
    this.path = path
    this.query = query
  }
  static getInstance() {
    if (routerOperation) { return routerOperation }
    routerOperation = new RouterOperation(window)
    return routerOperation
  }
  static redirectTo(path: string, query: Query = {}) {
    RouterOperation.getInstance().redirectTo(path, query)
  }
  redirectTo(path: string, query: Query = {}) {
    let location = `#${path}`
    if (Object.keys(query).length > 0) {
      location = `${location}?${queryString.stringify(query)}`
    }
    // window.history.pushState({}, '', location)
    this.window.location = location
  }
}
