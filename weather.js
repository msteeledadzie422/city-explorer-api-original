const axios = require('axios').default;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }

  static getForecasts(lat, lon, cityExplorerRes) {
    lat = parseFloat(lat).toFixed(3);
    lon = parseFloat(lon).toFixed(3);
    axios.get(`https://api.weatherbit.io/v2.0/forecast/daily/?key=${WEATHER_API_KEY}&days=3&lat=${lat}&lon=${lon}`)
      .then((response) => {
        const forecasts = this.makeForecasts(response.data);
        cityExplorerRes.send(forecasts);
      })
      .catch((error) => {
        cityExplorerRes.sendStatus(404).send('City not found in weather data: ' + error);
      });
  }

  static makeForecasts(city) {
    const forecasts = city.data.map((data) => {
      const date = data.valid_date;
      const description =
          `Low of ${data.low_temp}, ` +
          `high of ${data.high_temp} ` +
          `with ${data.weather.description}`;
      return new Forecast(date, description);
    });
    return forecasts;
  }
}

module.exports = Forecast;