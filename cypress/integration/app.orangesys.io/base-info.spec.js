/// <reference types="Cypress" />

describe('base info', function() {
  before(function() {
    cy.visit('/base-info')
  })

  it('full company name and full name, save and notice', function() {
    const email = Cypress.env('TEST_EMAIL')
    const company_name = Cypress.env('TEST_COMPANY_NAME')
    const full_name = Cypress.env('TEST_FULL_NAME')

    cy.get('input[name="email"]').should('have.value', email)

    cy.get('input[name="companyName"]')
      .clear()
      .type(company_name)
    cy.get('input[name="fullName"]')
      .clear()
      .type(full_name)

    cy.get('button[type="submit"]').click()
  })
})
