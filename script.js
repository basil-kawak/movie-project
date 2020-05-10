'use strict';



const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185';
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
const CONTAINER = document.querySelector('.container');
const homeBtn = document.getElementById('homeBtn');
const dropDownMenu = document.getElementsByClassName('dropdown-menu')[0];
const searchBox = document.getElementById('search-box');
const actorsListBtn = document.getElementById('actors-list');


// Don't touch this function please
const autorun = async () => {
	const movies = await fetchMovies();
	renderMovies(movies.results);
};
// Don't touch this function please
const constructUrl = (path) => {
	// console.log(atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI='))
	return `${TMDB_BASE_URL}/${path}?api_key=${atob(
		'NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI='
	)}`;
};



// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
	const movieRes = await fetchMovie(movie.id);
	const relatedMoveiCredits = await fetchCredits(movie.id);//.slice(0, 5);
	const relatedMoveiCredits5 = relatedMoveiCredits.cast.slice(0, 5)
	console.log(relatedMoveiCredits5)
	const credits = await fetchCredits(movie.id);
	const RelatedMovies = await fetchRelatedMovies(movie.id);
	const trailer = await fetchTrailer(movie.id);
	renderMovie(movieRes, trailer, credits);
	renderCredits(relatedMoveiCredits5);
	renderRelatedMovies(RelatedMovies);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
	const url = constructUrl(`movie/now_playing`);
	const res = await fetch(url);
	return res.json();
};

/**************** ACTOR LIST PAGE ************** */
//1- fetch moveis
//2- map in movies array
//3- push all movies credits to an actor list array...
const fetchPopularActors = async () => {
	const url = constructUrl(`person/popular`);
	const res = await fetch(url);
	return res.json();
};

const renderPopularActors = async () => {
	let actorsList = await fetchPopularActors();
	actorsList = actorsList.results;
	console.log('fofo')
	CONTAINER.innerHTML = '';
	const homepageDiv = document.createElement('div');
	homepageDiv.setAttribute('class', 'row');
	CONTAINER.appendChild(homepageDiv);
	// console.log(homepageDiv.innerHTML);
	actorsList.map((actor) => {
		const movieDiv = document.createElement('div');
		movieDiv.setAttribute('class', 'col-md-4');
		movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt="${
			actor.name
		} poster">
		<h3>${actor.name}</h3>`;
		movieDiv.addEventListener('click', () => {
			// Here majd's note (goes single actor render)):
			movieDetails(movie);
		});

		homepageDiv.appendChild(movieDiv);
	});
};
// actorsListBtn.addEventListener('click', renderPopularActors());


/****************  Trailer ************** */
const fetchTrailer = async (movie_id) => {
	const url = constructUrl(`movie/${movie_id}/videos`);
	const res = await fetch(url);
	return res.json();
};
/****************  serach box ************** */
// Fetch search result
const fetchSearchResult = async (keyWord) => {
	const res = await fetch(
		`https://api.themoviedb.org/3/search/multi?api_key=542003918769df50083a13c415bbc602&language=en-US&query=${keyWord}`
	);
	return res.json();
};
searchBox.addEventListener('input', async () => {
	let keyWord = searchBox.value;
	console.log(keyWord);
	let searchResult = await fetchSearchResult(keyWord);
	let actorsArray = [];
	let moviesArray = [];
	searchResult.results.map((result) => {
		if (result.known_for_department === 'Acting') {
			actorsArray.push(result);
		} else if (result.media_type === 'movie') {
			moviesArray.push(result);
		}
	});
	renderMovies(moviesArray);
	console.log(actorsArray);
	// actorsArray.forEach((element, index) => {
	// 	console.log(element);
	// 	renderCredits(element, index);
	// });
	//renderCredits(actorsArray); // renderActors function goes here
});
/****************  related movies ************** */
// Fetch related movies
const fetchRelatedMovies = async (movie_id) => {
	const url = constructUrl(`movie/${movie_id}/similar`);
	const res = await fetch(url);
	return res.json();
};
// render related movies
const renderRelatedMovies = async (RelatedMovies) => {
	const relatedMoviesDiv = document.createElement('div');
	relatedMoviesDiv.setAttribute('id', 'related-movies-div');
	CONTAINER.appendChild(relatedMoviesDiv);
	RelatedMovies.results.map((movie, index) => {
		if (index < 5) {
			const relatedMoviesDivtag = document.createElement('div');
			relatedMoviesDivtag.setAttribute('id', 'related-movie-div');
			relatedMoviesDivtag.innerHTML = `<p>${movie.title}</p>
			<a href="${movie.title}">
			<img border="0" alt="${movie.title}" src="${BACKDROP_BASE_URL}${movie.poster_path}" width="100" height="200"/>
			</a>`;
			// generAtag.addEventListener('click', () => {
			// 	fetchMovie(movie.id);
			// });

			relatedMoviesDiv.appendChild(relatedMoviesDivtag);
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
	console.log(credits);
	const actorsList = document.getElementById('actors');
	credits.map((actor, index) => {
		
			const actorAtag = document.createElement('li');
			actorAtag.innerHTML = `<p>${actor.name}</p>
      <img src="${BACKDROP_BASE_URL + actor.profile_path}" alt = "${
				actor.name
			}" width = "100px"/>`;
			// generAtag.addEventListener('click', () => {
			// 	fetchMovie(movie.id);
			// });

			actorsList.appendChild(actorAtag);
	});
};

/**************** Movie LIst sorted by Genres ***************/
// Movie Fetcher

const fetchMoviesByGenres = async (genreId) => {
	const res = await fetch(
		`https://api.themoviedb.org/3/discover/movie?api_key=542003918769df50083a13c415bbc602&with_genres=${genreId}`
	);
	return res.json();
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
	const movies = await fetchMovies();
	//   console.log(movies.results);

	let geners = await fetchGeners();
	// console.log(geners)
	geners.genres.map((gener) => {
		const generAtag = document.createElement('a');
		generAtag.setAttribute('class', 'dropdown-item');
		generAtag.innerText = `${gener.name}`;
		generAtag.setAttribute('value', `${gener.id}`);
		generAtag.addEventListener('click', async () => {
			console.log(gener.id);
			let genreInfo = await fetchMoviesByGenres(gener.id);

			console.log(genreInfo);
			renderMovies(genreInfo.results);
		});

		dropDownMenu.appendChild(generAtag);
	});
};
// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
	const url = constructUrl(`movie/${movieId}`);
	const res = await fetch(url);
	console.log(res);

	return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
	CONTAINER.innerHTML = '';
	const homepageDiv = document.createElement('div');
	homepageDiv.setAttribute('class', 'row');
	CONTAINER.appendChild(homepageDiv);
	// console.log(homepageDiv.innerHTML);
	movies.map((movie) => {
		const movieDiv = document.createElement('div');
		movieDiv.setAttribute('class', 'col-md-4');
		movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
			movie.title
		} poster">
        <h3>${movie.title}</h3>`;
		movieDiv.addEventListener('click', () => {
			movieDetails(movie);
		});

		homepageDiv.appendChild(movieDiv);
	});
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, trailer, credits) => {
	let director = credits.crew.find((directorName) => {
		return directorName.job === 'Director';
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
			<p id="movie-director "><b>Movie Director:</b> ${director.name}</p>
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
