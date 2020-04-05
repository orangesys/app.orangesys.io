/// <reference types="Cypress" />

describe('verification guide', function() {
  before(function() {
    cy.visit('/verification-guide')
  })

  it('need to verify email', function() {
    cy.contains('メールアドレスの認証')
    // TODO: add notice
    cy.contains('確認メールを再送信').click()
  })
})
