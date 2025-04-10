import {
  checkWeather,
  apiKey,
  weatherIcon,
  mapApiUrl,
} from './checkWeather.js';

const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');

function drawWeather() {
  searchButton.addEventListener('click', () => {
    const inputValue = searchInput.value;
    checkWeather(inputValue);
    searchInput.value = '';

    const maxCity = 10;
    const list = document.querySelector('.history-list');
    const existingCity = Array.from(list.children).map(
      (item) => item.textContent,
    );

    if (inputValue !== '' && !existingCity.includes(inputValue)) {
      (async function addHistory() {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        if (response.status === 200) {
          const li = document.createElement('li');
          const node = document.createTextNode(inputValue);
          li.appendChild(node);
          list.prepend(li);

          li.addEventListener('mouseover', () => {
            li.style.color = 'darkred';
            li.style.fontSize = '27px';
          });

          li.addEventListener('mouseout', () => {
            li.style.color = '#4d220e';
            li.style.fontSize = '26px';
          });

          li.addEventListener('click', () => {
            const weatherData = JSON.parse(localStorage.getItem(inputValue));
            if (weatherData) {
              document.querySelector('.city').innerHTML = weatherData.name;
              document.querySelector('.temp').innerHTML =
                Math.round(weatherData.main.temp) + '&#8451';
              document.querySelector('.humidity').innerHTML =
                weatherData.main.humidity + '%';
              document.querySelector('.wind-speed').innerHTML =
                Math.round(weatherData.wind.speed) + ' km/h';

              if (weatherData.weather[0].main == 'Clear') {
                weatherIcon.className = 'fa-solid fa-sun';
              } else if (weatherData.weather[0].main == 'Rain') {
                weatherIcon.className = 'fa-solid fa-cloud-rain';
              } else if (weatherData.weather[0].main == 'Mist') {
                weatherIcon.className = 'fa-solid fa-cloud-mist';
              } else if (weatherData.weather[0].main == 'Drizzle') {
                weatherIcon.className = 'fa-solid fa-cloud-drizzle';
              }

              const { coord } = weatherData;
              const lat = coord.lat;
              const lon = coord.lon;
              const map = document.querySelector('.map');
              map.innerHTML = `<img src="${mapApiUrl}&ll=${lon},${lat}&size=500,450&z=10"></img>`;
            }
          });

          if (list.querySelectorAll('li').length > maxCity) {
            list.querySelectorAll('li')[maxCity].remove();
          }
        }
      })();
    }
  });
}
drawWeather();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await fetch(apiUrl);
      if (response.status === 200) {
        const data = await response.json();
        checkWeather(data.name);
      }
    });
  }
}
getLocation();
