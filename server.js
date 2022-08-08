'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const server = express();
server.use(cors());
const axios = require('axios').default;

const PORT = process.env.PORT;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

class Movies {
  constructor(title, overview, averageVotes, totalVotes, imageUrl, popularity, releasedOn) {
    this.title = title;
    this.overview = overview;
    this.average_votes = averageVotes;
    this.total_votes = totalVotes;
    this.image_url = imageUrl;
    this.popularity = popularity;
    this.released_on = releasedOn;
  }

  static getMovies(cityName, cityExplorerRes) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${cityName}&include_adult=false`;
    console.log(url);
    axios.get(url)
      .then((response) => {
        console.log(response.data.results);
        const movies = this.makeMoviesList(response.data.results);
        cityExplorerRes.send(movies);
      })
      .catch((error) => {
        cityExplorerRes.sendStatus(404).send('City not found in movie data: ' + error);
      });
  }

  static makeMoviesList(movieArray) {
    const movies = movieArray.map((movie) => {
      return new Movies(movie.original_title,
        movie.overview,
        movie.vote_average,
        movie.vote_count,
        'https://image.tmdb.org/t/p/w500' + movie.poster_path,
        movie.popularity,
        movie.release_date);
    });
    return movies;
  }
}

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
