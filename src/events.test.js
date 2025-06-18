import { drawWeather } from './events';
import { checkWeather, renderMap, renderWeather } from './weather';
import { getLocation } from './events';

jest.mock('./weather', () => ({
  checkWeather: jest.fn(),
  renderWeather: jest.fn(),
  renderMap: jest.fn(),
}));

globalThis.fetch = jest.fn();

describe('drawWeather', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="search-box">
        <input type="text" />
        <button>Search</button>
      </div>
      <ul class="history-list"></ul>
    `;

    fetch.mockClear();
    checkWeather.mockClear();
    renderMap.mockClear();
    renderWeather.mockClear();
  });

  it('should call checkWeather and clear input', async () => {
    const input = document.querySelector('.search-box input');
    const button = document.querySelector('.search-box button');
    input.value = 'Moscow';

    checkWeather.mockResolvedValueOnce({ name: 'Moscow', coord: {} });
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({}),
    });

    drawWeather();
    button.click();

    await new Promise((r) => setTimeout(r));

    expect(checkWeather).toHaveBeenCalledWith('Moscow');
    expect(renderWeather).toHaveBeenCalled();
    expect(renderMap).toHaveBeenCalled();
    expect(input.value).toBe('');
  });

  it('should not call checkWeather on empty input', () => {
    const input = document.querySelector('.search-box input');
    const button = document.querySelector('.search-box button');
    input.value = '   ';

    drawWeather();
    button.click();

    expect(checkWeather).not.toHaveBeenCalled();
  });

  it('should add the city to history if it is not there yet', async () => {
    const input = document.querySelector('.search-box input');
    const button = document.querySelector('.search-box button');
    const list = document.querySelector('.history-list');
    input.value = 'Paris';

    checkWeather.mockResolvedValueOnce({ name: 'Paris', coord: {} });
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({}),
    });

    drawWeather();
    button.click();

    await new Promise((r) => setTimeout(r));

    const items = list.querySelectorAll('li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('Paris');
  });

  it('should not add the city to history again', async () => {
    const list = document.querySelector('.history-list');
    const li = document.createElement('li');
    li.textContent = 'Berlin';
    list.appendChild(li);

    const input = document.querySelector('.search-box input');
    const button = document.querySelector('.search-box button');
    input.value = 'Berlin';

    checkWeather.mockResolvedValueOnce({ name: 'Berlin', coord: {} });

    drawWeather();
    button.click();

    await new Promise((r) => setTimeout(r));

    const items = list.querySelectorAll('li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toBe('Berlin');
  });

  it('should delete the oldest history item when 10 cities are exceeded', async () => {
    const input = document.querySelector('.search-box input');
    const button = document.querySelector('.search-box button');
    const list = document.querySelector('.history-list');

    for (let i = 0; i < 10; i++) {
      const li = document.createElement('li');
      li.textContent = `City${i}`;
      list.appendChild(li);
    }

    input.value = 'NewCity';

    checkWeather.mockResolvedValueOnce({ name: 'NewCity', coord: {} });
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({}),
    });

    drawWeather();
    button.click();

    await new Promise((r) => setTimeout(r));

    const items = list.querySelectorAll('li');
    expect(items.length).toBe(10);
    expect(Array.from(items).some((li) => li.textContent === 'NewCity')).toBe(
      true,
    );
  });

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
