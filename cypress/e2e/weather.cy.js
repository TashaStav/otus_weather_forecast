describe('weather app - home page', () => {
  beforeEach(() => {
    cy.visit('https://tashastav.github.io/otus_weather_forecast/');
  });

  it('should open successfully and show title and search form', () => {
    cy.contains('Wether today');
    cy.get('input[type="text"]').should('exist');
    cy.get('button').contain('Show');
  });
});
