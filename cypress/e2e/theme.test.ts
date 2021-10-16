import Keys from '@/lib/keys';
import { Theme } from '@/lib/themes';

describe('Theme switch', () => {
  function waitForStateToLoad() {
    return cy.getBySelector('theme-switch__label').should('be.visible');
  }

  function clickOnSwitch() {
    cy.getBySelector('theme-switch').click();
  }

  function refresh() {
    cy.reload();
    waitForStateToLoad();
  }

  function checkTheme(theme: Theme) {
    const label = theme === Theme.Light ? 'theme: light' : 'theme: dark';
    const bodyClass = theme === Theme.Light ? 'light' : 'dark';

    cy.contains(label).should('be.visible');
    cy.get('body').should('have.class', bodyClass);
  }

  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
    waitForStateToLoad();
    checkTheme(Theme.Light);
  });

  it('should switch to dark on click', () => {
    clickOnSwitch();
    checkTheme(Theme.Dark);
  });

  it('should load dark after change and refresh', () => {
    clickOnSwitch();
    checkTheme(Theme.Dark);
    refresh();
    checkTheme(Theme.Dark);
  });

  it('should switch to light after initial dark load', () => {
    clickOnSwitch();
    checkTheme(Theme.Dark);
    refresh();
    checkTheme(Theme.Dark);
    refresh();
    clickOnSwitch();
    checkTheme(Theme.Light);
  });

  it('should toggle on shortcut press', () => {
    cy.triggerShortcut(Keys.Background);
    checkTheme(Theme.Dark);
    refresh();
    cy.triggerShortcut(Keys.Background);
    checkTheme(Theme.Light);
  });

  it('should conserve theme when changing pages', () => {
    clickOnSwitch();
    checkTheme(Theme.Dark);
    cy.getBySelector('footer__about').click();
    waitForStateToLoad();
    checkTheme(Theme.Dark);
    cy.visit('/');
    waitForStateToLoad();
    checkTheme(Theme.Dark);
  });
});
