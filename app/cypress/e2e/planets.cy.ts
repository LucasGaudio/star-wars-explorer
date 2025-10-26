describe('Fluxo principal de planetas', () => {
  it('carrega a lista e navega para os detalhes', () => {
    cy.visit('/planets');
    cy.contains('Tatooine').should('exist');
    cy.contains('Tatooine').click();
    cy.url().should('include', '/planets/');
    cy.contains('Clima').should('exist');
  });

  it('realiza busca por nome', () => {
    cy.visit('/planets');
    cy.get('input[placeholder="Buscar planeta"]').type('Alderaan');
    cy.contains('Alderaan').should('exist');
  });
});
