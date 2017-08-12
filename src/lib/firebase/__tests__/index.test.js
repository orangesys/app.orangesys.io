// @flow
import assert from 'power-assert'
import td from 'testdouble'
import { FirebaseFactory } from '../index'

describe('FirebaseFactory', () => {
  it('getInstance returns a firebase instance', () => {
    const firebaseLib = td.object({ initializeApp: () => {} })
    const config = { opt1: true }
    const firebase = FirebaseFactory.getInstance(firebaseLib, config)
    td.verify(firebaseLib.initializeApp(config))
    assert(firebase != null)
  })
  it('getInstance returns same object', () => {
    const instance1 = FirebaseFactory.getInstance({}, {})
    const instance2 = FirebaseFactory.getInstance({}, {})
    assert(instance1 === instance2)
  })
})
