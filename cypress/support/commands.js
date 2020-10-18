Cypress.Commands.add("getBySel", (selector, ...args) => {
  cy.get(`[data-testid=${selector}]`, ...args).should("be.visible");
  return cy.get(`[data-testid=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
  cy.get(`[data-testid*=${selector}]`, ...args).should("be.visible");
  return cy.get(`[data-testid=${selector}]`, ...args);
});

Cypress.Commands.add("triggerShortcut", key => {
  cy.get("body").trigger("keydown", { key });
});
