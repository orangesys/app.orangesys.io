/// <reference types="Cypress" />

describe('prepare > sign in', function() {
  before(function() {
    cy.fixture('account').as('account')
    cy.visit('/sign-in')
  })

  it('fill username and password, sign in', function() {
    cy.get('input[name="email"]').type(this.account.email)
    cy.get('input[name="password"]').type(this.account.password)
    cy.get('button[type="submit"]').click()

    cy.contains('Logout')
  })
})
