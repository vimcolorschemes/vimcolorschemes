/// <reference types="Cypress" />

const axeRunContext = {
  exclude: [['*[data-ignore-a11y]']],
};
const axeRunOptions = {};

describe('Accessibility tests', () => {
  beforeEach(() => {
    cy.visit('/').get('main').injectAxe();
  });

  it('should not have detectable accessibility violations on load', () => {
    cy.checkA11y(axeRunContext, axeRunOptions);
  });
});
