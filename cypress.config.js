const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://tashastav.github.io',
    supportFile: false,
    setupNodeEvents(on, config) {},
  },
});
