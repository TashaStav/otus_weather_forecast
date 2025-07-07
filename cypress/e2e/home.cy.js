describe('Weather App – Home Page', () => {
  beforeEach(() => {
    cy.visit('https://tashastav.github.io/otus_weather_forecast/#/', {
      onBeforeLoad(win) {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
          cb({ coords: { latitude: 55.75, longitude: 37.62 } });
        });
      }
    });
  });

  it('должен отобразить главную страницу и показать погоду по геолокации', () => {
    cy.get('#home-page', { timeout: 10000 }).should('be.visible');
    cy.get('#home-page .city', { timeout: 10000 }).should('not.have.text', '');
  });

  it('должен перейти на страницу города и отобразить погоду для введённого города', () => {
    // Заглушаем запрос к погоде для London
    cy.intercept('GET', '**/data/2.5/weather?q=London**', {
      statusCode: 200,
      body: {
        name: 'London',
        main: { temp: 15 },
        weather: [{ description: 'cloudy', icon: '04d' }],
        sys: { country: 'GB' }
      }
    }).as('getLondonWeather');

    // Вводим город и кликаем поиск
    cy.get('#home-form input').clear().type('London');
    cy.get('#home-form button').click();

    // Проверяем, что URL поменялся на страницу города
    cy.url().should('include', '#/city/');

    // Ждём запрос на погоду для Лондона (на странице города)
    cy.wait('@getLondonWeather');

    // Проверяем, что на странице города появился нужный город
    cy.get('#city-page .city').should('contain.text', 'London');
  });
});
