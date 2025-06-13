export const apiKey = '65ac23436cb9e7ba055876f993d6c41c';
const mapApiKey = '2e5928cb-06a1-4190-8975-ae2d88ba9c7b';
const mapApiUrl = `https://static-maps.yandex.ru/v1?apikey=${mapApiKey}`;

export async function checkWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;
  const response = await fetch(apiUrl);
  if (response.status === 200) {
    return await response.json();
  } else {
    const error = document.querySelector('.error');
    if (error) error.classList.add('visible');

    setTimeout(() => {
      error.classList.remove('visible');
    }, 3000);

    throw new Error('City not found');
  }
}

export function renderWeather(data) {
  document.querySelector('.city').innerHTML = data.name;
  document.querySelector('.temp').innerHTML =
    Math.round(data.main.temp) + '&#8451';
  document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
  document.querySelector('.wind-speed').innerHTML =
    Math.round(data.wind.speed) + ' km/h';

  const weatherIcon = document.querySelector('.weather-img i');
  const main = data.weather[0].main;
  if (main === 'Clear') {
    weatherIcon.className = 'fa-solid fa-sun';
  } else if (main === 'Rain') {
    weatherIcon.className = 'fa-solid fa-cloud-rain';
  } else if (main === 'Mist') {
    weatherIcon.className = 'fa-solid fa-cloud-mist';
  } else if (main === 'Drizzle') {
    weatherIcon.className = 'fa-solid fa-cloud-drizzle';
  }
}

export function renderMap({ lat, lon }) {
  const map = document.querySelector('.map');
  map.innerHTML = `<img src="${mapApiUrl}&ll=${lon},${lat}&size=500,450&z=10"></img>`;
}

export function saveToLocalStorage(city, data) {
  localStorage.setItem(city, JSON.stringify(data));
}
