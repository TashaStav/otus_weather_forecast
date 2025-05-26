/* eslint-disable prettier/prettier */
/**
 *  @jest-environment jsdom
 */

import { checkWeather, renderWeather, renderMap } from './weather';


globalThis.fetch = jest.fn();

describe('weather', () => {
    describe('checkWeather', () => {
        beforeEach(() => {
        fetch.mockClear();
    });

    it('shoul return data on successful response', async () => {
        const mockData = {
        name: 'Moscow',
        main: { temp: 28 },
        weather: [{ main: 'Clear' }],
    };
        fetch.mockResolvedValueOnce({
        status: 200,
        json: async () => mockData,
    });

    const data = await checkWeather('Moscow');

    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('Moscow'));
  });

  it('should return error if the status is 404', async() =>{
    fetch.mockResolvedValueOnce({
        status: 404
    });

    await expect(checkWeather('invalid city')).rejects.toThrow('City not found');
  });
});
describe('renderWeather', () =>{
    beforeEach(()=>{
        document.body.innerHTML= `
        <div class="city"></div>
        <div class="temp"></div>
        <div class="humidity"></div>
        <div class="wind-speed"></div>
        <div class="weather-img"><i></i></div>
        `;
    });

    it('should display weather data end sun icon on "Clear"', () => {
        const mockData = {
        name: 'Moscow',
        main: { temp: 28, humidity: 30 },
        wind: {speed: 4},
        weather: [{ main: 'Clear' }],
    };

    renderWeather(mockData);

    expect(document.querySelector('.city').innerHTML).toBe('Moscow');
    expect(document.querySelector('.temp').textContent).toBe('28℃');
    expect(document.querySelector('.humidity').innerHTML).toBe('30%');
    expect(document.querySelector('.wind-speed').innerHTML).toBe('4 km/h');
    expect(document.querySelector('.weather-img i').className).toBe('fa-solid fa-sun');
        });
    });

describe('renderMap', () => {
    beforeEach(()=> {
        document.body.innerHTML = `<div class="map"></div>`;
    });

    it('should add a map of Moscow by coordinates', ()=>{

        const lon = 37.6156;
        const lat = 55.7522;

        renderMap({lat, lon});

        const mapElement = document.querySelector('.map');
        expect(mapElement.innerHTML).toContain('img');
        expect(mapElement.innerHTML).toContain(`ll=${lon},${lat}`);
        expect(mapElement.innerHTML).toContain('static-maps.yandex.ru');
        });
    });
});
