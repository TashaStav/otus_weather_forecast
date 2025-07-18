const BASE_URL = '/otus_weather_forecast'

describe('Weather App – City Page', () => {
  it('should load the city search page and show the weather for Paris', () => {
    cy.visit(`${BASE_URL}/`) 

    cy.window().then((win) => {
      win.history.pushState({}, '', `${BASE_URL}/city`)
      win.dispatchEvent(new Event('popstate'))
    })


    cy.get('#city-form input[name="cityName"]', { timeout: 10000 })
      .should('exist')
      .clear({ force: true })
      .type('Paris', { force: true })

    cy.get('#city-form').submit()

    cy.get('.city', { timeout: 20000 }).should('contain.text', 'Paris')
    cy.get('.temp').should('not.be.empty')
  })
})

