const form = document.querySelector('.search-box');
const apiKey = '65ac23436cb9e7ba055876f993d6c41c';
const mapApiKey = '2e5928cb-06a1-4190-8975-ae2d88ba9c7b';
const mapApiUrl = `https://static-maps.yandex.ru/v1?apikey=${mapApiKey}`;

const weatherIcon = document.querySelector('.weather-img i');
const error = document.querySelector('.error');

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
});

async function checkWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;
  const response = await fetch(apiUrl);
  if (response.status === 404) {
    error.style.display = 'block';
  } else {
    const data = await response.json();
    console.log(data);

    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.temp').innerHTML =
      Math.round(data.main.temp) + '&#8451';
    document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
    document.querySelector('.wind-speed').innerHTML =
      Math.round(data.wind.speed) + ' km/h';

    if (data.weather[0].main == 'Clear') {
      weatherIcon.className = 'fa-solid fa-sun';
    } else if (data.weather[0].main == 'Rain') {
      weatherIcon.className = 'fa-solid fa-cloud-rain';
    } else if (data.weather[0].main == 'Mist') {
      weatherIcon.className = 'fa-solid fa-cloud-mist';
    } else if (data.weather[0].main == 'Drizzle') {
      weatherIcon.className = 'fa-solid fa-cloud-drizzle';
    }

    error.style.display = 'none';

    const { coord } = data;
    const lat = coord.lat;
    const lon = coord.lon;
    const map = document.querySelector('.map');
    map.innerHTML = `<img src="${mapApiUrl}&ll=${lon},${lat}&size=500,450&z=10"></img>`;

    localStorage.setItem(city, JSON.stringify(data));
  }
}

export { checkWeather, apiKey, weatherIcon, mapApiUrl };
