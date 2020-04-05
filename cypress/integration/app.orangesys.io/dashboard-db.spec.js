/// <reference types="Cypress" />

describe('dashboard db', function() {
  before(function() {
    cy.visit('/db')
  })

  it('URL, JWT Token', function() {
    cy.contains('URL')
    cy.contains('JWT Token')
  })
})
