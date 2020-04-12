/// <reference types="Cypress" />

describe('sign in', function() {
  beforeEach(function() {
    cy.fixture('account').as('account')
  })

  it('send password reset email', function() {
    cy.visit('/sign-in')
    cy.contains('パスワード再設定').click()
    cy.get('[data-cy=password-reset]')
      .should('be.visible')
      .within(() => {
        cy.get('input[name="email"]').type(this.account.email)
        cy.contains('button', '送信').click()
      })

    cy.contains('パスワード再設定のメールを送信しました')
  })

  it('fill username and password, sign in', function() {
    cy.visit('/sign-in')
    cy.get('input[name="email"]').type(this.account.email)
    cy.get('input[name="password"]').type(this.account.password)
    cy.get('button[type="submit"]').click()

    cy.contains('Logout')
  })
})
