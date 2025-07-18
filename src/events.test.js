import {
  drawWeather,
  handleSearchForm,
  loadHistory,
  saveHistory,
  getLocation,
} from './events';
import { checkWeather, renderMap, renderWeather } from './weather';

jest.mock('./weather', () => ({
  checkWeather: jest.fn(),
  renderWeather: jest.fn(),
  renderMap: jest.fn(),
}));

globalThis.fetch = jest.fn();

beforeEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
  jest.clearAllMocks();
});

describe('handleSearchForm', () => {
  it('should update URL and dispatch popstate when submitting the form', () => {
    document.body.innerHTML = `
    <form class="search-box">
      <input type="text" value="Moscow">
      <button type="submit">Show</button>
    </form>
  `;

    const form = document.querySelector('.search-box');
    handleSearchForm(form);

    form.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );

    expect(window.location.pathname).toBe('/otus_weather_forecast/city/Moscow');
  });
});

describe('history functionality', () => {
  it('loadHistory returns an array from localStorage', () => {
    localStorage.setItem('cityHistory', JSON.stringify(['Berlin']));
    expect(loadHistory()).toEqual(['Berlin']);
  });

  it('saveHistory saves an array to localStorage', () => {
    saveHistory(['London']);
    expect(localStorage.getItem('cityHistory')).toBe(
      JSON.stringify(['London']),
    );
  });

  it('loadHistory returns an empty array if localStorage is empty', () => {
    expect(loadHistory()).toEqual([]);
  });
});

describe('drawWeather', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should render history and display weather for the last city', async () => {
    localStorage.setItem('cityHistory', JSON.stringify(['Paris']));

    document.body.innerHTML = `
      <ul class="history-list"></ul>
      <section class="weather-history">
        <div class="city"></div>
      </section>
    `;

    const mockData = {
      coord: { lat: 48.85, lon: 2.35 },
    };

    checkWeather.mockResolvedValueOnce(mockData);

    await drawWeather();

    expect(checkWeather).toHaveBeenCalledWith('Paris');
    expect(renderWeather).toHaveBeenCalledWith(
      mockData,
      expect.any(HTMLElement),
    );
    expect(renderMap).toHaveBeenCalledWith(
      mockData.coord,
      expect.any(HTMLElement),
    );

    const listItem = document.querySelector('.history-list li');
    expect(listItem.textContent).toBe('Paris');
  });
  it('should handle click on history item and display its weather', async () => {
    localStorage.setItem('cityHistory', JSON.stringify(['Rome', 'Madrid']));

    document.body.innerHTML = `
    <main>
    <section class="weather-history">
      <div class="city"></div>
      <div class="temp"></div>
      <div class="humidity"></div>
      <div class="wind-speed"></div>
      <div class="weather-img"><i></i></div>
      <div class="map"></div>
      <div class="error"></div>
    </section>
    </main>
    <ul class="history-list"></ul>
    `;

    const mockCoord = { lat: 41.9, lon: 12.5 };
    checkWeather.mockResolvedValue({
      coord: mockCoord,
      name: 'Rome',
      main: { temp: 20, humidity: 50 },
      wind: { speed: 5 },
      weather: [{ main: 'Clear' }],
    });

    await drawWeather();

    const romeItem = document.querySelector('.history-list li');
    romeItem.click();

    await new Promise((r) => setTimeout(r));

    expect(checkWeather).toHaveBeenCalledWith('Rome');
    expect(renderWeather).toHaveBeenCalled();
    expect(renderMap).toHaveBeenCalled();
  });
});

describe('geolocation', () => {
  it('should call renderWeather and renderMap on successful geolocation', async () => {
    const mockPosition = {
      coords: { latitude: 55.75, longitude: 37.61 },
    };

    globalThis.navigator.geolocation = {
      getCurrentPosition: (successCallback) => {
        successCallback(mockPosition);
      },
    };

    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ coord: { lat: 55.75, lon: 37.61 } }),
    });

    getLocation();

    await new Promise((r) => setTimeout(r));

    expect(fetch).toHaveBeenCalled();
    expect(renderWeather).toHaveBeenCalled();
    expect(renderMap).toHaveBeenCalled();
  });
});
