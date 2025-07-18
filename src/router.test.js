import { router } from './router.js';
import * as weather from './weather.js';
import * as events from './events.js';

describe('router', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main>
        <section id="home-page"><div class="error visible"></div></section>
        <section id="history-page"></section>
        <section id="city-page"><div class="city-weather"></div><div class="city"></div></section>
      </main>
    `;
  });
  it('should call getLocation on path /', () => {
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost/'),
      writable: true,
    });

    const getLocationSpy = jest
      .spyOn(events, 'getLocation')
      .mockImplementation(() => {});

    router();
    expect(getLocationSpy).toHaveBeenCalled();
  });

  it('should call drawWeather on path /history', () => {
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost/history'),
      writable: true,
    });

    const drawWeatherSpy = jest
      .spyOn(events, 'drawWeather')
      .mockImplementation(() => {});

    router();
    expect(drawWeatherSpy).toHaveBeenCalled();
  });

  it('should call weather rendering functions on path /city/Moscow', async () => {
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost/city/Moscow'),
      writable: true,
    });

    const checkWeatherMock = jest
      .spyOn(weather, 'checkWeather')
      .mockResolvedValue({
        coord: { lat: 55.75, lon: 37.61 },
        name: 'Moscow',
      });

    const renderWeather = jest
      .spyOn(weather, 'renderWeather')
      .mockImplementation(() => {});
    const renderMap = jest
      .spyOn(weather, 'renderMap')
      .mockImplementation(() => {});
    const saveHistory = jest
      .spyOn(events, 'saveHistory')
      .mockImplementation(() => {});
    jest.spyOn(events, 'loadHistory').mockReturnValue([]);

    await router();

    expect(checkWeatherMock).toHaveBeenCalledWith('Moscow');
    expect(renderWeather).toHaveBeenCalled();
    expect(renderMap).toHaveBeenCalled();
    expect(saveHistory).toHaveBeenCalled();
  });
});
