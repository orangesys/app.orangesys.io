/// <reference types="Cypress" />

describe('base info', function() {
  before(function() {
    cy.visit('/base-info')
  })

  it('full company name and full name, save and notice', function() {
    const email = Cypress.env('test_email')
    const company_name = Cypress.env('test_company_name')
    const full_name = Cypress.env('test_full_name')

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
