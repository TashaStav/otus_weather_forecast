describe('Weather App – City Page', () => {
  it('should load the city search page and show the weather for Paris', () => {
    cy.visit('https://tashastav.github.io/otus_weather_forecast/#/city/Paris');

    cy.get('#city-page', { timeout: 10000 }).should('be.visible');

    cy.get('#city-page h2, #city-page .city').should('contain.text', 'Paris');
  });
});

