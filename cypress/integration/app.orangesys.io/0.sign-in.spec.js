/// <reference types="Cypress" />

describe('sign in', function() {
  it('send password reset email', function() {
    const email = Cypress.env('test_email')

    cy.visit('/sign-in')
    cy.contains('パスワード再設定').click()
    cy.get('[data-cy=password-reset]')
      .should('be.visible')
      .within(() => {
        cy.get('input[name="email"]').type(email)
        cy.contains('button', '送信').click()
      })

    cy.contains('パスワード再設定のメールを送信しました')
  })

  it('fill username and password, sign in', function() {
    const email = Cypress.env('test_email')
    const password = Cypress.env('test_password')

    cy.visit('/sign-in')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()

    cy.contains('Logout')
  })
})
