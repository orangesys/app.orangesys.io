/// <reference types="Cypress" />

describe('sign up', function() {
  before(function() {
    cy.visit('/sign-up')
  })
  it('fill information and, sign up', () => {
    cy.get('input[name="companyName"]').type('Orangesys')
    cy.get('input[name="fullName"]').type('TEST')
    cy.get('input[name="email"]').type(`test${Math.floor(Math.random() * 100)}@orangesys.io`)
    cy.get('input[name="password"]').type('testing')

    cy.server()
    cy.route('POST', '/identitytoolkit/v3/relyingparty/signupNewUser*').as('signupNewUser')
    cy.route('POST', '/identitytoolkit/v3/relyingparty/getAccountInfo*').as('getAccountInfo')
    cy.get('button[type="submit"]').click()
    cy.contains('signupNewUser')
    cy.wait('@getAccountInfo')

    cy.contains('メールアドレスの認証')
  })
})
