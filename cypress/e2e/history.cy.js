const BASE_URL = '/otus_weather_forecast'

describe('Weather App – History page', () => {
  it('should load saved cities and allow clicking on history item', () => {
    cy.visit(`${BASE_URL}/`)

    cy.window().then((win) => {
      win.localStorage.setItem('cityHistory', JSON.stringify(['London', 'Rome']))
    })

    cy.reload()

    cy.get('.history-list li', { timeout: 10000 }).should('contain.text', 'London')

    cy.contains('.history-list li', 'London').click({ force: true })

    cy.get('.city', { timeout: 20000 }).should('contain.text', 'London')
    cy.get('.temp').should('not.be.empty')
  })
})