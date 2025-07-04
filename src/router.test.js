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

    window.location.hash = '#/';
  });

  it('should call showHome on hash #/', () => {
    const showHomeSpy = jest
      .spyOn(events, 'getLocation')
      .mockImplementation(() => {});
    router();
    expect(showHomeSpy).toHaveBeenCalled();
  });

  it('should call showHistory on hash #/history', () => {
    window.location.hash = '#/history';
    const drawWeatherSpy = jest
      .spyOn(events, 'drawWeather')
      .mockImplementation(() => {});
    router();
    expect(drawWeatherSpy).toHaveBeenCalled();
  });

  it('should call showCity with hash #/city/Moscow', async () => {
    window.location.hash = '#/city/Moscow';
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
