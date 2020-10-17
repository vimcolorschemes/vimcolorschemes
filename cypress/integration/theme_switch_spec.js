const LIGHT_THEME_LABEL = "dark theme: off";
const DARK_THEME_LABEL = "dark theme: on";
const LIGHT_THEME_BODY_CLASS = "light";
const DARK_THEME_BODY_CLASS = "dark";

describe("Theme switch", () => {
  it("should default to light", () => {
    cy.visit("/");

    cy.contains(LIGHT_THEME_LABEL).should("be.visible");
    cy.get("body").should("have.class", LIGHT_THEME_BODY_CLASS);
  });

  it("should switch to dark on click", () => {
    cy.visit("/");

    cy.get(".theme-switch", { timeout: 3000 }).click();

    cy.contains(DARK_THEME_LABEL).should("be.visible");
    cy.get("body").should("have.class", DARK_THEME_BODY_CLASS);
  });

  it("should load dark after change and refresh", () => {
    cy.visit("/");

    cy.contains(LIGHT_THEME_LABEL).should("be.visible");
    cy.get("body").should("have.class", LIGHT_THEME_BODY_CLASS);

    cy.get(".theme-switch", { timeout: 3000 }).click();

    cy.contains(DARK_THEME_LABEL).should("be.visible");
    cy.get("body").should("have.class", DARK_THEME_BODY_CLASS);

    cy.reload();

    cy.contains(DARK_THEME_LABEL).should("be.visible");
    cy.get("body").should("have.class", DARK_THEME_BODY_CLASS);
  });

  it("should switch to light after loading dark after reload", () => {
    cy.visit("/");

    cy.contains(LIGHT_THEME_LABEL).should("be.visible");
    cy.get("body").should("have.class", LIGHT_THEME_BODY_CLASS);

    cy.get(".theme-switch", { timeout: 3000 }).click();

    cy.contains(DARK_THEME_LABEL).should("be.visible");
    cy.get("body").should("have.class", DARK_THEME_BODY_CLASS);

    cy.reload();

    cy.contains(DARK_THEME_LABEL).should("be.visible");
    cy.get("body").should("have.class", DARK_THEME_BODY_CLASS);

    cy.reload();

    cy.get(".theme-switch", { timeout: 3000 }).click();

    cy.contains(LIGHT_THEME_LABEL).should("be.visible");
    cy.get("body").should("have.class", LIGHT_THEME_BODY_CLASS);
  });

  it("should toggle on shortcut press", () => {
    cy.visit("/");

    cy.contains(LIGHT_THEME_LABEL).should("be.visible");
    cy.get("body").should("have.class", LIGHT_THEME_BODY_CLASS);

    cy.document().trigger("keydown", { key: "b" });

    cy.contains(DARK_THEME_LABEL).should("be.visible");
    cy.get("body").should("have.class", DARK_THEME_BODY_CLASS);

    cy.document().trigger("keydown", { key: "b" });

    cy.contains(LIGHT_THEME_LABEL).should("be.visible");
    cy.get("body").should("have.class", LIGHT_THEME_BODY_CLASS);
  });
});
