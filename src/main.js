import {
  drawWeather,
  getLocation,
  handleSearchForm,
  initBurgerMenu,
} from './events.js';
import { router, BASE_URL } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  router();

  window.addEventListener('popstate', router);

  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[data-link]');
    if (target) {
      e.preventDefault();
      const url = target.getAttribute('href');
      history.pushState(null, '', `${BASE_URL}${url}`);
      router();
    }
  });

  const homeForm = document.querySelector('#home-form');
  const cityForm = document.querySelector('#city-form');

  if (homeForm) {
    handleSearchForm(homeForm);
  }
  if (cityForm) {
    handleSearchForm(cityForm);
  }

  initBurgerMenu();
});

drawWeather();
getLocation();
