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
  });

  it("should default to light", () => {
    checkTheme(THEMES.LIGHT);
  });

  it("should switch to dark on click", () => {
    checkTheme(THEMES.LIGHT);
    clickOnSwitch();
    checkTheme(THEMES.DARK);
  });

  it("should load dark after change and refresh", () => {
    checkTheme(THEMES.LIGHT);
    clickOnSwitch();
    checkTheme(THEMES.DARK);
    refresh();
    checkTheme(THEMES.DARK);
  });

  it("should switch to light after initial dark load", () => {
    checkTheme(THEMES.LIGHT);
    clickOnSwitch();
    checkTheme(THEMES.DARK);
    refresh();
    checkTheme(THEMES.DARK);
    refresh();
    clickOnSwitch();
    checkTheme(THEMES.LIGHT);
  });

  it("should toggle on shortcut press", () => {
    checkTheme(THEMES.LIGHT);
    cy.document().trigger("keydown", { key: KEYS.BACKGROUND });
    checkTheme(THEMES.DARK);
    cy.document().trigger("keydown", { key: KEYS.BACKGROUND });
    checkTheme(THEMES.LIGHT);
  });
});
