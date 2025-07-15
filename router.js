import { checkWeather, renderMap, renderWeather } from './weather.js';
import {
  drawWeather,
  getLocation,
  loadHistory,
  saveHistory,
  showErr,
} from './events.js';

const BASE_URL = '/otus_weather_forecast';
export function router() {
  const path = window.location.pathname.replace(BASE_URL, '') || '/';

  if (path === '/' || path === '/index.html') {
    showHome();
  } else if (path === '/history') {
    showHistory();
  } else if (path.startsWith('/city/')) {
    const city = decodeURIComponent(path.split('/city/')[1]);
    showCity(city);
  } else {
    showHome();
  }
}

window.addEventListener('popstate', router);

export function showHome() {
  showSection('home-page');

  const homeSection = document.querySelector('#home-page');
  const error = homeSection.querySelector('.error');
  if (error) error.classList.remove('visible');

  getLocation();
}

export function showHistory() {
  showSection('history-page');
  drawWeather();
}

async function showCity(cityName) {
  const container = document.querySelector('.city-weather');

  try {
    const weatherData = await checkWeather(cityName);
    showSection('city-page');

    container.innerHTML = ` <h2>Weather in ${cityName}</h2>`;
    const section = document.querySelector('#city-page');

    renderWeather(weatherData, section);
    renderMap(weatherData.coord, section);

    let history = loadHistory();
    const maxCity = 10;
    if (!history.includes(cityName)) {
      history.unshift(cityName);
      if (history.length > maxCity) {
        history = history.slice(0, maxCity);
      }
      saveHistory(history);
    }
  } catch {
    showErr('city-page');
  }
}

export function showSection(idToShow) {
  const section = document.querySelectorAll('main > section');
  section.forEach((sec) => {
    sec.hidden = sec.id !== idToShow;

    if (sec.id === 'city-page') {
      const container = sec.querySelector('.city-weather');
      const cityElem = sec.querySelector('.city');
      if (container) container.innerHTML = '';
      if (cityElem) cityElem.textContent = '';
    }
  });
}
