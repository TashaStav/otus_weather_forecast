import { checkWeather, renderMap, renderWeather } from './weather.js';
import {
  drawWeather,
  getLocation,
  loadHistory,
  saveHistory,
  showErr,
} from './events.js';

export function router() {
  const routes = {
    '#/': showHome,
    '#/history': showHistory,
  };

  const hash = window.location.hash;
  const paramMatch = hash.match(/^#\/city\/(.+)/);

  if (paramMatch) {
    showCity(paramMatch[1]);
    return;
  }

  const route = routes[hash];
  route();
}

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
  const decodedCity = decodeURIComponent(cityName);

  try {
    const weatherData = await checkWeather(decodedCity);
    showSection('city-page');

    container.innerHTML = ` <h2>Weather in ${decodedCity}</h2>`;
    const section = document.querySelector('#city-page');

    renderWeather(weatherData, section);
    renderMap(weatherData.coord, section);

    let history = loadHistory();
    const maxCity = 10;
    if (!history.includes(decodedCity)) {
      history.unshift(decodedCity);
      if (history.length > maxCity) {
        history = history.slice(0, maxCity);
      }
      saveHistory(history);
    }
  } catch {
    showErr();
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
