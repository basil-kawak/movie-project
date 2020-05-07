'use strict';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185';
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
const CONTAINER = document.querySelector('.container');
const homeBtn = document.getElementById('homeBtn');
const dropDownMenu = document.getElementsByClassName('dropdown-menu')[0];

// Don't touch this function please
const autorun = async () => {
	const movies = await fetchMovies();
	renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
	return `${TMDB_BASE_URL}/${path}?api_key=${atob(
		'NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI='
	)}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
	const movieRes = await fetchMovie(movie.id);
	const credits = await fetchCredits(movie.id);
	renderMovie(movieRes);
	renderCredits(credits);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
	const url = constructUrl(`movie/now_playing`);
	const res = await fetch(url);
	return res.json();
};

// Fetch credits
const fetchCredits = async (movie_id) => {
	const url = constructUrl(`movie/${movie_id}/credits`);
	const res = await fetch(url);
	return res.json();
};
// render credits
const renderCredits = async (credits) => {
	const actorsList = document.getElementById('actors');
	console.log(actorsList);
	console.log(credits);
	credits.cast.map((actor) => {
		const actorAtag = document.createElement('li');
		actorAtag.innerText = `${actor.name}`;
		// generAtag.addEventListener('click', () => {
		// 	fetchMovie(movie.id);
		// });

		actorsList.appendChild(actorAtag);
	});
};
// Gener DropDown Menu fetcher
const fetchGeners = async () => {
	const url = constructUrl(`genre/movie/list`);
	const res = await fetch(url);
	return res.json();
};
// Gener DropDown Menu Render
const renderGeners = async () => {
	let geners = await fetchGeners();
	console.log(geners);
	geners.genres.map((gener) => {
		const generAtag = document.createElement('a');
		generAtag.setAttribute('class', 'dropdown-item');
		generAtag.innerText = `${gener.name}`;
		generAtag.addEventListener('click', () => {
			fetchMovie(movie.id);
		});

		dropDownMenu.appendChild(generAtag);
	});
};
// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
	const url = constructUrl(`movie/${movieId}`);
	const res = await fetch(url);
	return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
	movies.map((movie) => {
		const movieDiv = document.createElement('div');
		movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
			movie.title
		} poster">
        <h3>${movie.title}</h3>`;
		movieDiv.addEventListener('click', () => {
			movieDetails(movie);
		});

		CONTAINER.appendChild(movieDiv);
	});
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
	CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
								BACKDROP_BASE_URL + movie.backdrop_path
							}>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
							movie.release_date
						}</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

document.addEventListener('DOMContentLoaded', async function () {
	autorun();
	renderGeners();
});
