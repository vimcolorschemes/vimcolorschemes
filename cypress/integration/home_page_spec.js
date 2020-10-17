describe("Home page", () => {
  it("should load the app & checks for the site title", () => {
    cy.visit("/");
    cy.contains("vimcolorschemes");
  });
});
