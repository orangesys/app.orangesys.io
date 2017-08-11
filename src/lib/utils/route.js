// @flow
import RouteParser from 'route-parser'
import URL from 'url-parse'
import qs from 'query-string'

export const params = (pattern: string, path: string): {[key: string]: string} => {
  const route = new RouteParser(pattern)
  const result = route.match(path)
  return result || null
}

export const match = (pattern: string, path: string): boolean => !!params(pattern, path)

export const getRouteInfoFromWindow = (window: window) => {
  const hash = window.location.hash.replace(/^#/, '')
  const url = new URL(hash)
  const path = url.pathname.toString()
  const query = qs.parse(url.query)
  return { path, query }
}
