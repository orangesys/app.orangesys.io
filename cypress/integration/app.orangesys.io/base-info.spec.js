/// <reference types="Cypress" />

describe('base info', function() {
  before(function() {
    cy.fixture('account').as('account')
    cy.visit('/base-info')
  })

  it('full company name and full name, save and notice', function() {
    // TODO: global notice, not depend page

    cy.get('input[name="email"]').should('have.value', this.account.email)

    cy.get('input[name="companyName"]')
      .clear()
      .type(this.account.companyName)
    cy.get('input[name="fullName"]')
      .clear()
      .type(this.account.fullName)

    cy.get('button[type="submit"]').click()
  })
})
