import 'babel-polyfill'
import assert from 'power-assert'
import td from 'testdouble'
import Slack from '../../../src/notification/slack'

describe('createBodyData', () => {
  it('throws an error', () => {
    const slack = new Slack('url-dummy')
    assert.throws(() => {
      slack.createBodyData()
    }, Error)
  })
})

describe('sendMessage', () => {
  it('calls fetch with bodyData', async () => {
    const ingradients = { thisIs: 'an ingradient' }
    const bodyData = { body: 'data' }
    const url = 'url-dummy'
    const fetchMock = td.function('fetch mock')
    const requestData = {
      method: 'post',
      body: JSON.stringify(bodyData),
    }
    td.when(fetchMock(url, requestData)).thenResolve({ ok: true })

    const slack = new Slack(url, fetchMock)
    td.replace(slack, 'createBodyData')
    td.when(slack.createBodyData(ingradients)).thenReturn(bodyData)
    const ok = await slack.sendMessage(ingradients)
    assert(ok)
  })
})
