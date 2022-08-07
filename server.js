'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weather = require('./data/weather.json');
const server = express();
server.use(cors());

const PORT = process.env.PORT;

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
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

function findCity(name, lat, lon) {
  try {
    const city = weather.find((element) => {
      return (
        name === element.city_name &&
        Math.round(lat) === Math.round(element.lat) &&
        Math.round(lon) === Math.round(element.lon)
      );
    });
    return city;
  } catch (error) {
    throw new Error('No City Match in Weather Data' + error);
  }
}

server.get('/weather', (request, response) => {
  console.log(request.query);
  const queries = request.query;
  const city = findCity(queries.city_name, queries.lat, queries.lon);

  if (city) {
    response.status(200).send(Forecast.makeForecasts(city));
  } else {
    response.status(404).send('City not found in weather data');
  }
});

server.listen(PORT, () => {
  console.log('Server is running on port :: ' + PORT);
});
