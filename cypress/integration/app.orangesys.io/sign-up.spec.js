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
    cy.get('button[type="submit"]').click()

    cy.contains('メールアドレスの認証')
  })
})
