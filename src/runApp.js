import { checkWeather } from './checkWeather.js';

const form = document.querySelector('.search-box');
form.addEventListener('submit', (ev) => {
  ev.preventDefault();
});

checkWeather();
