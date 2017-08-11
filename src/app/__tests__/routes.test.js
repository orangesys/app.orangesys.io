// @flow
import assert from 'power-assert'

import routes from '../routes'

const checkIfAccessible = (path: string, status: Object) => {
  const result = routes.judge(path, status)
  assert(result.accessible)
  assert(result.redirectPath == null)
  assert(result.TargetComponent != null)
}

const checkIfNotAccessible = (path: string, status: Object) => {
  const result = routes.judge(path, status)
  assert(result.accessible === false)
  assert(result.redirectPath != null)
  assert(result.TargetComponent === null)
}

describe('/sign-in', () => {
  const path = '/sign-in'
  it('allows access if not authenticated', () => {
    const status = { loggedIn: false, emailVerified: false }
    checkIfAccessible(path, status)
  })
  it("doesn't allows access if authenticated", () => {
    const status = { loggedIn: true, emailVerified: false }
    checkIfNotAccessible(path, status)
  })
})

describe('/sign-up', () => {
  const path = '/sign-up'
  it('allows access if not authenticated', () => {
    const status = { loggedIn: false, emailVerified: false }
    checkIfAccessible(path, status)
  })
  it("doesn't allows access if authenticated", () => {
    const status = { loggedIn: true, emailVerified: false }
    checkIfNotAccessible(path, status)
  })
})

describe('/', () => {
  const path = '/'
  it("doesn't allows access if not authenticated", () => {
    const status = { loggedIn: false }
    checkIfNotAccessible(path, status)
  })
  it("doesn't allows access if email isn't verified", () => {
    const status = { loggedIn: true, emailVerified: false }
    checkIfNotAccessible(path, status)
  })
  it("doesn't allows access if server setup isn't completed", () => {
    const status = {
      loggedIn: true, emailVerified: true, planSelected: true, serverSetupCompleted: false,
    }
    checkIfNotAccessible(path, status)
  })
  it('allows access if authenticated and email is verified and server setup is completed', () => {
    const status = {
      loggedIn: true, emailVerified: true, planSelected: true, serverSetupCompleted: true,
    }
    checkIfAccessible(path, status)
  })
})

describe('/verification-guide', () => {
  const path = '/verification-guide'
  it("doesn't allows access if not authenticated", () => {
    const status = { loggedIn: false }
    checkIfNotAccessible(path, status)
  })
  it("doesn't allows access if email is already verified", () => {
    const status = { loggedIn: true, emailVerified: true }
    checkIfNotAccessible(path, status)
  })
  it('allows access if authenticated and email is not verified', () => {
    const status = { loggedIn: true, emailVerified: false }
    checkIfAccessible(path, status)
  })
})

describe('/email-action', () => {
  const path = '/email-action'
  it('allows access if not authenticated', () => {
    const status = { loggedIn: false }
    checkIfAccessible(path, status)
  })
})

describe('/verify-email', () => {
  const path = '/verify-email'
  it("doesn't allows access if not authenticated", () => {
    const status = { loggedIn: false }
    checkIfNotAccessible(path, status)
  })
  it('allows access if authenticated', () => {
    const status = { loggedIn: true }
    checkIfAccessible(path, status)
  })
})

describe('/setup/plan', () => {
  const path = '/setup/plan'
  it("doesn't allows access if not authenticated", () => {
    const status = { loggedIn: false }
    checkIfNotAccessible(path, status)
  })
  it("doesn't allows access if email isn't verified", () => {
    const status = { loggedIn: true, emailVerified: false }
    checkIfNotAccessible(path, status)
  })
  it("doesn't allows access if plan is already selected", () => {
    const status = { loggedIn: true, emailVerified: true, planSelected: true }
    checkIfNotAccessible(path, status)
  })
  it('allows access if email is verified and plan is not selected', () => {
    const status = { loggedIn: true, emailVerified: true, planSelected: false }
    checkIfAccessible(path, status)
  })
})
