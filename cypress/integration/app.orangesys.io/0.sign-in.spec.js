/// <reference types="Cypress" />

describe('sign in', function() {
  it('send password reset email', function() {
    const email = Cypress.env('TEST_EMAIL')

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
    const email = Cypress.env('TEST_EMAIL')
    const password = Cypress.env('TEST_PASSWORD')

    cy.visit('/sign-in')
    cy.get('input[name="email"]').type(email)
    cy.get('input[name="password"]').type(password)

    cy.server()
    cy.route('POST', '/identitytoolkit/v3/relyingparty/verifyPassword*').as('verifyPassword')
    cy.route('POST', '/identitytoolkit/v3/relyingparty/getAccountInfo*').as('getAccountInfo')

    cy.get('button[type="submit"]').click()
    cy.wait('@verifyPassword')
    cy.wait('@getAccountInfo')

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000)

    cy.contains('Logout')
  })
})
