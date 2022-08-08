const axios = require('axios').default;
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

module.exports = Movies;
