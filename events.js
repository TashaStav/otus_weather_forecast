import { checkWeather, renderMap, renderWeather } from './weather.js';

export function attachForm() {
  const form = document.querySelector('.search-box');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
  });
}
export function drawWeather() {
  const searchInput = document.querySelector('.search-box input');
  const searchButton = document.querySelector('.search-box button');
  const maxCity = 10;
  const list = document.querySelector('.history-list');

  searchButton.addEventListener('click', async () => {
    const inputValue = searchInput.value.trim();
    if (inputValue === '') {
      return;
    }
    const weatherData = await checkWeather(inputValue);
    renderWeather(weatherData);
    renderMap(weatherData.coord);
    searchInput.value = '';

    const existingCity = Array.from(list.children).map(
      (item) => item.textContent,
    );

    if (!existingCity.includes(inputValue)) {
      (async function addHistory() {
        const apiKey = '65ac23436cb9e7ba055876f993d6c41c';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        if (response.status === 200) {
          const li = document.createElement('li');
          li.textContent = inputValue;
          list.prepend(li);

          li.addEventListener('mouseover', () => {
            li.style.color = 'darkred';
            li.style.fontSize = '27px';
          });

          li.addEventListener('mouseout', () => {
            li.style.color = '#4d220e';
            li.style.fontSize = '26px';
          });

          li.addEventListener('click', async () => {
            const weatherData = await checkWeather(inputValue);
            renderWeather(weatherData);
            renderMap(weatherData.coord);
          });

          if (list.querySelectorAll('li').length > maxCity) {
            list.querySelectorAll('li')[maxCity].remove();
          }
        }
      })();
    }
  });
}

export function getLocation() {
  const apiKey = '65ac23436cb9e7ba055876f993d6c41c';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await fetch(apiUrl);
      if (response.status === 200) {
        const data = await response.json();
        renderWeather(data);
        renderMap(data.coord);
      }
    });
  }
}
