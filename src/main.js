import {
  drawWeather,
  getLocation,
  handleSearchForm,
  initBurgerMenu,
} from './events.js';
import { router } from './router.js';

drawWeather();
getLocation();

document.addEventListener('DOMContentLoaded', () => {
  const homeForm = document.querySelector('#home-form');
  const cityForm = document.querySelector('#city-form');

  if (homeForm) {
    handleSearchForm(homeForm);
  }
  if (cityForm) {
    handleSearchForm(cityForm);
  }
  router();
  initBurgerMenu();
});
window.addEventListener('hashchange', router);
