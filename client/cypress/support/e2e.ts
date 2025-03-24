// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-file-upload";

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
      /**
       * Custom command to upload a file
       * @example cy.get('[data-cy=upload]').attachFile('example.json')
       */
      attachFile(fileName: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Add custom command for selecting elements by data-cy attribute
Cypress.Commands.add(
  "dataCy",
  (value: string): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get(`[data-cy=${value}]`);
  }
);
