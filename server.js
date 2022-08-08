'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const server = express();
server.use(cors());

const PORT = process.env.PORT;

const Forecast = require('./weather');
const Movies = require('./movies');

server.get('/weather', (request, response) => {
  console.log(request.query);
  Forecast.getForecasts(request.query.lat, request.query.lon, response);
});

server.get('/movies', (request, response) => {
  console.log(request.query);
  Movies.getMovies(request.query.city_name, response);
});

server.listen(PORT, () => {
  console.log('Server is running on port :: ' + PORT);
});
