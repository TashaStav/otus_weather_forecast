import {
  drawWeather,
  getLocation,
  handleSearchForm,
  initBurgerMenu,
} from './events.js';
import { router } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  router();

  window.addEventListener('popstate', router);

  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[data-link]');
    if (target) {
      e.preventDefault();
      const url = target.getAttribute('href');
      history.pushState(null, '', url);
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
