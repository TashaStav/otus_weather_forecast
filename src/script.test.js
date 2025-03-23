import { checkWeather } from './script.js';
describe('checkWeather', () => {
  beforeEach(() => {
    document.body.innerHTML = `
        <div class="city"></div>
        <div class="temp"></div>
        <div class="humidity"></div>
        <div class="wind-speed"></div>
      `;
  });

  it('is a function', () => {
    expect(checkWeather).toBeInstanceOf(Function);
  });
});
