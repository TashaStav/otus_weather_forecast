const apiKey = '65ac23436cb9e7ba055876f993d6c41c';

const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=Moscow&appid=${apiKey}`;

export async function checkWeather() {
  const response = await fetch(apiUrl);
  const data = await response.json();

  document.querySelector('.city').innerHTML = data.name;
  document.querySelector('.temp').innerHTML =
    Math.round(data.main.temp) + '&#8451';
  document.querySelector('.humidity').innerHTML = data.main.humidity + '%';
  document.querySelector('.wind-speed').innerHTML =
    Math.round(data.wind.speed) + ' km/h';
}
// checkWeather();
