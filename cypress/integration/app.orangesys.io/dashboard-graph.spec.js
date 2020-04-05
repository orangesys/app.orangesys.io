/// <reference types="Cypress" />

describe('dashboard graph', function() {
  before(function() {
    cy.visit('/graph')
  })

  it('URL, User Name, Password', function() {
    cy.contains('URL')
    cy.contains('User Name')
    cy.contains('Password')
  })
})
