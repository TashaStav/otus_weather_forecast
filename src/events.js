import { renderMap, renderWeather, apiKey, checkWeather } from './weather.js';

export function handleSearchForm(form) {
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const searchInput = form.querySelector('input');
    const city = searchInput.value.trim();

    if (!city) return;

    window.location.hash = `#/city/${encodeURIComponent(city)}`;
    searchInput.value = '';
  });
}

export function showErr() {
  const visibleSection = document.querySelector('main > section:not([hidden])');

  const error = visibleSection.querySelector('.error');

  error.classList.add('visible');

  setTimeout(() => {
    error.classList.remove('visible');
  }, 3000);
}

const storageKey = 'cityHistory';

export function loadHistory() {
  return JSON.parse(localStorage.getItem(storageKey)) || [];
}

export function saveHistory(history) {
  localStorage.setItem(storageKey, JSON.stringify(history));
}

export async function drawWeather() {
  const list = document.querySelector('.history-list');
  let history = loadHistory();

  renderHistory(history);

  if (history.length > 0) {
    const lastCity = history[0];
    const lastLi = list.querySelector('li');
    if (lastLi) {
      await renderCityWeather(lastCity, lastLi);
    }
  }

  function renderHistory(arrHistory) {
    list.innerHTML = '';
    arrHistory.forEach((city) => {
      const li = document.createElement('li');
      li.textContent = city;

      li.addEventListener('mouseover', () => {
        li.style.color = 'darkred';
        li.style.fontSize = '27px';
      });

      li.addEventListener('mouseout', () => {
        li.style.color = '#4d220e';
        li.style.fontSize = '26px';
      });

      li.addEventListener('click', () => {
        renderCityWeather(city, li);
      });

      list.appendChild(li);
    });
  }

  async function renderCityWeather(city, liEl) {
    const historyContainer = document.querySelector('.weather-history');
    list
      .querySelectorAll('li')
      .forEach((li) => li.classList.remove('selected'));
    liEl.classList.add('selected');

    try {
      const data = await checkWeather(city);
      historyContainer.querySelector('.city').textContent =
        `Weather in ${city}`;
      renderWeather(data, historyContainer);
      renderMap(data.coord, historyContainer);
    } catch (err) {
      console.error(`Failed to fetch weather for ${city}:`, err);
      historyContainer.innerHTML = '';
    }
  }
}
export function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await fetch(apiUrl);
      if (response.status === 200) {
        const data = await response.json();
        const homeSection = document.querySelector('#home-page');
        renderWeather(data, homeSection);
        renderMap(data.coord, homeSection);
      }
    });
  }
}

export function initBurgerMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.history-list');

  burger.addEventListener('click', () => {
    burger.classList.toggle('change');
    menu.classList.toggle('open');
  });
}
