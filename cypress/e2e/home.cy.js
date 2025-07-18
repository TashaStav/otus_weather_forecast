const BASE_URL = '/otus_weather_forecast'

describe('Weather App – Home Page', () => {
  it('should load home page and display weather by geolocation', () => {
    cy.visit(`${BASE_URL}/`)

    cy.get('#home-page').should('be.visible')

    cy.get('#home-form input[name="cityName"]', { timeout: 10000 })
      .should('exist')
      .clear({ force: true })
      .type('Berlin', { force: true })

    cy.get('#home-form').submit()

    cy.get('.city', { timeout: 20000 }).should('contain.text', 'Berlin')
    cy.get('.temp').should('not.be.empty')
  })
})