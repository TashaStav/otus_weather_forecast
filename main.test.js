import {
  drawWeather,
  getLocation,
  handleSearchForm,
  initBurgerMenu,
} from './events.js';

jest.mock('./router.js', () => ({
  router: jest.fn(),
}));

import { router } from './router.js';

jest.mock('./events.js', () => ({
  drawWeather: jest.fn(),
  getLocation: jest.fn(),
  handleSearchForm: jest.fn(),
  initBurgerMenu: jest.fn(),
}));

describe('main.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="home-form"></form>
      <form id="city-form"></form>
    `;

    jest.clearAllMocks();
  });

  it('calls drawWeather and getLocation when the module is loaded', async () => {
    await import('./main.js');

    expect(drawWeather).toHaveBeenCalled();
    expect(getLocation).toHaveBeenCalled();
  });

  it('calls handleSearchForm, router and initBurgerMenu on DOMContentLoaded', async () => {
    await import('./main.js');

    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(handleSearchForm).toHaveBeenCalledTimes(2);
    expect(router).toHaveBeenCalled();
    expect(initBurgerMenu).toHaveBeenCalled();
  });

  it('calls router when popstate event is triggered', async () => {
    await import('./main.js');

    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(router).toHaveBeenCalled();
  });
});
