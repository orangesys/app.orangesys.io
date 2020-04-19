/// <reference types="Cypress" />

describe('server setup', function() {
  before(function() {
    cy.visit('/server-setup')
  })

  it('match page title', function() {
    cy.contains('サーバーセットアップ')
  })
})
