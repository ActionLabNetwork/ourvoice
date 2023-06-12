/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import 'cypress-file-upload'

Cypress.Commands.add('login', () => {
  // Your login logic here
  cy.intercept({ method: 'POST', url: 'http://authapi.ourvoice.test/auth/signinup/code' }).as(
    'postLogin'
  )

  cy.intercept({
    method: 'POST',
    url: 'http://authapi.ourvoice.test/auth/signinup/code/consume'
  }).as('postLoginConsume')

  // Visit the auth page and trigger the passwordless login auth flow
  cy.visit('http://auth.ourvoice.test/signinWithoutPassword?d=demo')
  cy.get('.input').type('test@ourvoice.app')
  cy.get('.button').click()
  cy.wait('@postLogin')

  // Visit the auth page
  cy.visit(
    'http://auth.ourvoice.test/verify?rid=passwordless&preAuthSessionId=4a3L55ZNKye5p6Rmk4tBEdUMBY79OoTAqtIHEyo_HL4=#OMz5kaYzzyFh_RF5UeIl6u81W2gwb2T-rp1lj9Hh5W8='
  )
  cy.wait('@postLoginConsume')
})

export {}
