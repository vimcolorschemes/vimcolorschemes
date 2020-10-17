describe("The Home Page", () => {
  it('successfully loads the app & checks for "vim" header content', () => {
    cy.visit("/");
    cy.contains("vim");
  });
});
