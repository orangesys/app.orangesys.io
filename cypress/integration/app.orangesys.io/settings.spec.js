/// <reference types="Cypress" />

describe('settings', function() {
  before(function() {
    cy.visit('/settings')
  })
  it('account setting', function() {
    const email = Cypress.env('test_email')

    cy.get('input[name="email"]').should('have.value', email)

    cy.contains('パスワード再設定').click()
    cy.contains('パスワード再設定用のメールを送信しました。')
  })
})
