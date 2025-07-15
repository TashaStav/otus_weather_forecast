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

export function renderWeather(data, root = document) {
  root.querySelector('.city').innerHTML = data.name;
  root.querySelector('.temp').innerHTML = Math.round(data.main.temp) + '&#8451';
  root.querySelector('.humidity').innerHTML = data.main.humidity + '%';
  root.querySelector('.wind-speed').innerHTML =
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

export function renderMap({ lat, lon }, root = document) {
  const map = root.querySelector('.map');
  const rect = map.getBoundingClientRect();
  const width = Math.round(rect.width);

  map.innerHTML = `<img src="${mapApiUrl}&ll=${lon},${lat}&size=${width},450&z=10"></img>`;
}
