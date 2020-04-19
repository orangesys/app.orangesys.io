/// <reference types="Cypress" />

describe('settings', function() {
  before(function() {
    cy.fixture('account').as('account')
    cy.visit('/settings')
  })

  it('account setting', function() {
    // TODO: global notice, not depend page

    cy.get('input[name="companyName"]').should('have.value', this.account.companyName)
    cy.get('input[name="fullName"]').should('have.value', this.account.fullName)
    cy.get('input[name="email"]').should('have.value', this.account.email)

    cy.contains('パスワード再設定').click()
    cy.contains('パスワード再設定用のメールを送信しました。')
  })

  it('payment setting', function() {
    cy.contains('支払い方法').click()
    // FIXME: iframe
    // cy.get('input[name="cardnumber"]')
    cy.contains('登録').click()
    cy.contains('Your card number is incomplete.')
  })
})
