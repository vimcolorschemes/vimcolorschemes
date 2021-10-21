/// <reference types="cypress" />

Cypress.Commands.add('getBySelector', (selector, ...args) => {
  cy.get(`[data-testid=${selector}]`, ...args).should('be.visible');
  return cy.get(`[data-testid=${selector}]`, ...args);
});

Cypress.Commands.add('triggerShortcut', key => {
  cy.get('body').trigger('keydown', { key, force: true });
});

declare namespace Cypress {
  interface Chainable {
    /**
     * Returns the element by querying its data-testid attribute
     *
     * @param {string} selector - The data-testid to look for
     * @returns {Object} The element found
     */
    getBySelector(selector: string): Chainable<Element>;

    /**
     * Triggers a keyboard shortcut on the document
     *
     * @param {string} key - The key to press
     */
    triggerShortcut(key: string): void;
  }
}
