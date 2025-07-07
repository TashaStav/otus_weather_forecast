describe('Weather App – History Page', () => {
  it('создаёт историю и отображает данные при клике', () => {
    // Перейти на главную
    cy.visit('https://tashastav.github.io/otus_weather_forecast');

    // Ввести город
    cy.get('#home-form input').type('Paris');
    cy.get('#home-form button').click();

    // Дождаться URL и заголовка
    cy.url().should('include', '#/city/Paris');
    cy.get('#city-page .weather .city', { timeout: 10000 }).should('contain', 'Paris');

    // Перейти на вкладку History
    cy.visit('https://tashastav.github.io/otus_weather_forecast/#/history');

    // Кликнуть на первую запись
    cy.get('.history-list li').first().click();

    // Проверить, что погода отображается
    cy.get('.weather-history .city').should('contain', 'Paris');
    cy.get('.weather-history .temp').should('be.visible');
  });
});
