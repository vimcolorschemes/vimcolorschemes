import Keys from '@/lib/keys';
import { Background } from '@/lib/background';

describe('Background switch', () => {
  function waitForStateToLoad() {
    return cy.getBySelector('background-switch__label').should('be.visible');
  }

  function clickOnSwitch() {
    cy.getBySelector('background-switch').click();
  }

  function refresh() {
    cy.reload();
    waitForStateToLoad();
  }

  function checkBackground(background: Background) {
    const label =
      background === Background.Light
        ? 'set background=light'
        : 'set background=dark';
    const bodyClass = background === Background.Light ? 'light' : 'dark';

    cy.contains(label).should('be.visible');
    cy.get('body').should('have.class', bodyClass);
  }

  beforeEach(() => {
    cy.visit('/');
    cy.clearLocalStorage();
    waitForStateToLoad();
    checkBackground(Background.Light);
  });

  it('should switch to dark on click', () => {
    clickOnSwitch();
    checkBackground(Background.Dark);
  });

  it('should load dark after change and refresh', () => {
    clickOnSwitch();
    checkBackground(Background.Dark);
    refresh();
    checkBackground(Background.Dark);
  });

  it('should switch to light after initial dark load', () => {
    clickOnSwitch();
    checkBackground(Background.Dark);
    refresh();
    checkBackground(Background.Dark);
    refresh();
    clickOnSwitch();
    checkBackground(Background.Light);
  });

  it('should toggle on shortcut press', () => {
    // TODO: find a better way to wait for event listeners to be registered
    cy.wait(2000);

    cy.triggerShortcut(Keys.Background);
    checkBackground(Background.Dark);

    refresh();

    cy.wait(2000);

    cy.triggerShortcut(Keys.Background);
    checkBackground(Background.Light);
  });

  it('should conserve background when changing pages', () => {
    clickOnSwitch();
    checkBackground(Background.Dark);
    cy.getBySelector('footer__about').click();
    waitForStateToLoad();
    checkBackground(Background.Dark);
    cy.visit('/');
    waitForStateToLoad();
    checkBackground(Background.Dark);
  });
});
