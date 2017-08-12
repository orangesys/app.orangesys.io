// @flow
import assert from 'power-assert'
import validate from '../validator'

describe('Validator#validate', () => {
  it('checks a simple rule', () => {
    const rules = {
      name: 'required',
      email: 'required',
    }
    const data = { name: '' }
    const actual = validate(rules, data)
    assert.deepEqual(actual, { name: '入力が必要です' })
  })

  it('can override the error message', () => {
    const rules = {
      name: 'required',
    }
    const data = { name: '' }
    const options = { messages: { required: ':attribute is required' } }
    const actual = validate(rules, data, options)
    assert.deepEqual(actual, { name: 'name is required' })
  })

  it('can override the field name', () => {
    const rules = {
      name: 'required',
    }
    const data = { name: '' }
    const options = {
      messages: { required: ':attribute が必要です' },
      attributeNames: { name: '氏名' },
    }
    const actual = validate(rules, data, options)
    assert.deepEqual(actual, { name: '氏名 が必要です' })
  })
})
