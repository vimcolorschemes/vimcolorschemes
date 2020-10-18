import { THEMES, KEYS } from "../../src/constants";

describe("Theme switch", () => {
  const waitForStateToLoad = () =>
    cy.getBySel("theme-switch-label").should("be.visible");

  const clickOnSwitch = () => cy.getBySel("theme-switch").click();

  const refresh = () => {
    cy.reload();
    waitForStateToLoad();
  };

  const checkTheme = theme => {
    const label = theme === THEMES.LIGHT ? "theme: light" : "theme: dark";
    const bodyClass = theme === THEMES.LIGHT ? "light" : "dark";

    cy.contains(label).should("be.visible");
    cy.get("body").should("have.class", bodyClass);
  };

  beforeEach(() => {
    cy.visit("/");
    cy.clearLocalStorage();
    waitForStateToLoad();
    checkTheme(THEMES.LIGHT);
  });

  it("should switch to dark on click", () => {
    clickOnSwitch();
    checkTheme(THEMES.DARK);
  });

  it("should load dark after change and refresh", () => {
    clickOnSwitch();
    checkTheme(THEMES.DARK);
    refresh();
    checkTheme(THEMES.DARK);
  });

  it("should switch to light after initial dark load", () => {
    clickOnSwitch();
    checkTheme(THEMES.DARK);
    refresh();
    checkTheme(THEMES.DARK);
    refresh();
    clickOnSwitch();
    checkTheme(THEMES.LIGHT);
  });

  it("should toggle on shortcut press", () => {
    cy.triggerShortcut(KEYS.BACKGROUND);
    checkTheme(THEMES.DARK);
    cy.triggerShortcut(KEYS.BACKGROUND);
    checkTheme(THEMES.LIGHT);
  });

  it("should conserve theme when changing pages", () => {
    clickOnSwitch();
    checkTheme(THEMES.DARK);
    cy.getBySel("footer-link-about").click();
    waitForStateToLoad();
    checkTheme(THEMES.DARK);
    cy.visit("/");
    waitForStateToLoad();
    checkTheme(THEMES.DARK);
  });
});
