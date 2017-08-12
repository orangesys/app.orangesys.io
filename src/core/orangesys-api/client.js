// @flow
/* eslint-disable no-underscore-dangle */
// import 'isomorphic-fetch'
import Config from './config'

type InitialArgs = {
  apiEndPoint?: string,
  _fetch?: any,
}

export default class OrangesysApiClient {
  apiEndPoint: string
  fetch: ?any

  constructor({
    apiEndPoint = Config.apiEndPoint,
    _fetch = window.fetch,
  }: InitialArgs) {
    this.apiEndPoint = apiEndPoint
    this.fetch = _fetch
  }

  async createServer(retention: string, uid: string) {
    const postUrl = `${this.apiEndPoint}/create?uuid=${uid}&rp=${retention}`
    const _fetch = this.fetch || fetch
    await _fetch(postUrl, { method: 'POST' })
  }

  /*
   * @return true if response includes X-INFLUXDB-VERSION header
   */
  async ping(consumerId: string, token: string): Promise<boolean> {
    const url = `https://${consumerId}.i.orangesys.io/ping?jwt=${token}`
    const _fetch = this.fetch || fetch
    const res = await _fetch(url, { method: 'HEAD', timeout: 1000 * 5 })
    return !!res.headers.get('x-influxdb-version')
  }

  /*
   * @return storage usage
   */
  async getStorageUsage(uid: string, consumerId: string): Promise<number> {
    const url = `${this.apiEndPoint}/storageusage?uuid=${uid}&consumerId=${consumerId}`
    const _fetch = this.fetch || fetch
    const res = await _fetch(url, { timeout: 1000 * 5 })
    const data = await res.json()
    return data.storageUsage
  }

}
