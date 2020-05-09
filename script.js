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
// homeBtn.addEventListener('click', reset());
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
	const RelatedMovies = await fetchRelatedMovies(movie.id);
	const trailer = await fetchTrailer(movie.id);
	renderMovie(movieRes, trailer, credits);
	renderCredits(credits);
	renderRelatedMovies(RelatedMovies);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
	const url = constructUrl(`movie/now_playing`);
	const res = await fetch(url);
	return res.json();
};
/****************  Trailer ************** */
const fetchTrailer = async (movie_id) => {
	const url = constructUrl(`movie/${movie_id}/videos`);
	const res = await fetch(url);
	return res.json();
};

/****************  related movies ************** */
// Fetch related movies
const fetchRelatedMovies = async (movie_id) => {
	const url = constructUrl(`movie/${movie_id}/similar`);
	const res = await fetch(url);
	return res.json();
};
// render related movies
const renderRelatedMovies = async (RelatedMovies) => {
	RelatedMovies.results.map((movie, index) => {
		if (index < 5) {
			const relatedMoviesDivtag = document.createElement('div');
			relatedMoviesDivtag.innerHTML = `<h3>${movie.title}</h3>
			<a href="${movie.title}">
			<img border="0" alt="${movie.title}" src="${BACKDROP_BASE_URL}${movie.poster_path}" width="100" height="200"/>
			</a>`;
			// generAtag.addEventListener('click', () => {
			// 	fetchMovie(movie.id);
			// });

			CONTAINER.appendChild(relatedMoviesDivtag);
		}
	});
};
/**************** credits ************** */
// Fetch credits
const fetchCredits = async (movie_id) => {
	const url = constructUrl(`movie/${movie_id}/credits`);
	const res = await fetch(url);
	return res.json();
};
// render credits
const renderCredits = async (credits) => {
	const actorsList = document.getElementById('actors');
	credits.cast.map((actor, index) => {
		if (index < 5) {
			const actorAtag = document.createElement('li');
			actorAtag.innerText = `${actor.name}`;
			// generAtag.addEventListener('click', () => {
			// 	fetchMovie(movie.id);
			// });

			actorsList.appendChild(actorAtag);
		}
	});
};
/**************** DropDown Menu ************** */
// Gener DropDown Menu fetcher
const fetchGeners = async () => {
	const url = constructUrl(`genre/movie/list`);
	const res = await fetch(url);
	return res.json();
};
// Gener DropDown Menu Render
const renderGeners = async () => {
	let geners = await fetchGeners();
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
const renderMovie = (movie, trailer, credits) => {
	// let director = credits.crew.find((directorName) => {
	// 	if (directorName.job === 'Director') {
	// 		console.log(directorName.name);
	// 		return directorName.name;
	// 	}
	// });
	let director = [];
	credits.crew.forEach((element) => {
		if (element.job === 'Director') {
			director.push(element.name);
		}
	});
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
			
			<img id="movie-production-company-logo" src='${
				BACKDROP_BASE_URL + movie.production_companies[0].logo_path
			}' width="100px"">
			<p id="movie-production-company"><b>production company:</b> ${
				movie.production_companies[0].name
			} Minutes</p>
			<p id="movie-language"><b>Movie Language:</b> ${movie.original_language}</p>
			<p id="movie-director "><b>Movie Director:</b> ${director[0]}</p>
			<p id="movie-vote-average "><b>vote average:</b> ${movie.vote_average}</p>
			<p id="movie-vote-count "><b>vote count:</b> ${movie.vote_count}</p>
            <h3>Overview:</h3>
			<p id="movie-overview">${movie.overview}</p>
			<iframe width='560' height='315' src="http://youtube.com/embed/${
				trailer.results[0].key
			}"></iframe>
        </div>
        </div>
            <h3>Actors:</h3>
			<ul id="actors" class="list-unstyled"></ul>
			<ul id="related-movie" class="list-unstyled"></ul>
    </div>`;
};

document.addEventListener('DOMContentLoaded', async function () {
	autorun();
	renderGeners();
});
