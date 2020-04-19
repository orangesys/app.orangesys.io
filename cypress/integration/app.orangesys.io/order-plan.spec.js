/// <reference types="Cypress" />
describe('order plan', function() {
  before(function() {
    cy.visit('/order-plan')
  })

  it('select small plan, and fill credit card information', function() {
    cy.contains('Small')
    // TODO: how to test iframe?
  })
})
