// @flow
/* eslint-disable no-unused-vars */
import 'isomorphic-fetch'

export default class Slack {
  webhookUrl: string
  message: Object
  fetch: Function

  constructor(webhookUrl: string, fetcher: any = fetch) {
    this.webhookUrl = webhookUrl
    this.fetch = fetcher
  }
  async sendMessage(ingradients: Object): Promise<boolean> {
    const bodyData = this.createBodyData(ingradients)
    const requestData: Object = {
      method: 'post',
      body: JSON.stringify(bodyData),
    }
    const res = await this.fetch(this.webhookUrl, requestData)
    if (!res.ok) {
      console.error(`status: ${res.status}, statusText: ${res.statusText} body: ${res.body ? res.body.toString() : ''}`)
    }
    return res.ok
  }

  createBodyData(ingradients: any): any {
    throw new Error('please implement createBodyData(data: Object)')
  }
}
