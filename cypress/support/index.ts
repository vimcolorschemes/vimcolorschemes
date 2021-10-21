import 'cypress-axe';
import '@testing-library/cypress/add-commands';

import './commands';

// ignore uncaught exceptions
Cypress.on('uncaught:exception', () => false);
