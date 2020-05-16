'use strict';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185';
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
const CONTAINER = document.querySelector('.container');
const homeBtn = document.getElementById('homeBtn');
const dropDownMenu = document.getElementsByClassName('dropdown-menu')[0];
const searchBox = document.getElementById('search-box');
const actorsListBtn = document.getElementById('actors-list');
const actorsList = document.createElement('ul').setAttribute('id', 'actors');

// Don't touch this function please

const autorun = async (filterResults) => {
	const movies = await fetchMovies(filterResults);
	CONTAINER.innerHTML = '';
	renderMovies(movies.results);
  };

// const autorun = async () => {
// 	const movies = await fetchMovies();
// 	renderMovies(movies.results);
// };
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
	const relatedMoveiCredits = await fetchCredits(movie.id); //.slice(0, 5);
	const relatedMoveiCredits6 = relatedMoveiCredits.cast.slice(0, 6);
	const credits = await fetchCredits(movie.id);
	const RelatedMovies = await fetchRelatedMovies(movie.id);
	let trailer = await fetchTrailer(movie.id);
	trailer = trailer.results;
	const trailerLink = {
		link:
			trailer.length > 0
				? `http://youtube.com/embed/${trailer[0].key}`
				: './img/noImage.svg',
	};
	renderMovie(
		movieRes,
		trailerLink,
		credits,
		relatedMoveiCredits6,
		RelatedMovies
	);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.

const fetchMovies = async (filternavbar) => {
	const url = constructUrl(`movie/${filternavbar}`);
	const res = await fetch(url);
	return res.json();
  };

// const fetchMovies = async () => {
// 	const url = constructUrl(`movie/now_playing`);
// 	const res = await fetch(url);
// 	return res.json();
// };

/**************** ACTOR LIST PAGE ************** */
const fetchPopularActors = async () => {
	const url = constructUrl(`person/popular`);
	const res = await fetch(url);
	return res.json();
};

const renderPopularActors = async () => {
	let actorsList = await fetchPopularActors();
	actorsList = actorsList.results;
	CONTAINER.innerHTML = '';
	const homepageDiv = document.createElement('div');
	homepageDiv.setAttribute('class', 'row');
	CONTAINER.appendChild(homepageDiv);
	actorsList.map((actor) => {
		const movieDiv = document.createElement('div');
		movieDiv.setAttribute('class', 'col-md-4');
		movieDiv.innerHTML = `
        <img src="${
					actor.profile_path
						? BACKDROP_BASE_URL + actor.profile_path
						: './img/noImage.svg'
				}" alt="${actor.name} poster" onclick =>
		<h3>${actor.name}</h3>`; //"renderActorDetails(${actor.id})"
		movieDiv.addEventListener('click', async () => {
			renderActorDetails(actor.id);
		});
		homepageDiv.appendChild(movieDiv);
	});
};

/****************  Singl Actor Page ************** */

const fetchActor = async (person_id) => {
	const url = constructUrl(`person/${person_id}`);
	const res = await fetch(url);
	return res.json();
};

const FetchActorMovies = async (actorId) => {
	const url = constructUrl(`person/${actorId}/movie_credits`);
	const res = await fetch(url);
	return res.json();
};
const renderActorDetails = async (actorId) => {
	CONTAINER.innerHTML = '';
	let actorInfo = await fetchActor(actorId);
	let actorMoviesInfo = await FetchActorMovies(actorId);
	let actorInfoArr = actorMoviesInfo.cast;
	const actorsInfosObj = {
		Name: actorInfo.name,
		Birthday: actorInfo.birthday || 'unknown!',
		Deathday: actorInfo.deathday || 'alive',
		Popularity: actorInfo.popularity,
		Picture: actorInfo.profile_path
			? BACKDROP_BASE_URL + actorInfo.profile_path
			: './img/noImage.svg',
		Biography: actorInfo.Biography || 'No Biography',
		Movies: actorInfoArr.length > 0 ? actorInfoArr : 'No Available Movies',
		Gender: actorInfo.gender === 2 ? 'Male' : 'Female',
	};
	CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="actor-img" src=${
								actorsInfosObj.Picture
									? actorsInfosObj.Picture
									: './img/noImage.svg'
							}>
        </div>
		<div class="col-md-8">
			<h2 id="actor-name">${actorsInfosObj.Name}</h2>
			<p id="actor-birthday"><b>Birthday:</b> ${actorsInfosObj.Birthday}</p>
			<p id="actor-deathday"><b>Deathday:</b> ${actorsInfosObj.Deathday}</p>
			<p id="actor-gender"><b>Gender:</b> ${actorsInfosObj.Gender}</p>
			<p id="actor-popularity"><b>Popularity:</b> ${actorsInfosObj.Popularity}</p>
			<p id="actor-biography "><b>Biography:</b> ${actorsInfosObj.Biography}</p>
		</div>
        <div>
		<h3>A list of movies the actor participated in:</h3>
			<ul id="actorParticipatedMovies" class="list-unstyled">
			</ul>
		</div>
	</div>`;
	const partivioatedMoviesList = document.getElementById(
		'actorParticipatedMovies'
	);

	/*********to chick if the actor has a movies or not (print No Available Movies )******* */

	if (typeof actorsInfosObj.Movies === 'string') {
		let movieLi = document.createElement('li');
		movieLi.innerHTML = `<p id="no-movie-found">${actorsInfosObj.Movies}</p>`;
		partivioatedMoviesList.appendChild(movieLi);
	} else if (typeof actorsInfosObj.Movies === 'object') {
		actorsInfosObj.Movies.map((movie, index) => {
			if (index < 5) {
				let movieLi = document.createElement('li');
				movieLi.innerHTML = `<p id="movie-title">${movie.title}</p>
				<img id="movie-img" src='${
					movie.poster_path
						? BACKDROP_BASE_URL + movie.poster_path
						: './img/noImage.svg'
				}' alt = '${movie.title}' width = '100'>`;
				movieLi.addEventListener('click', () => {
					movieDetails(movie);
				});
				partivioatedMoviesList.appendChild(movieLi);
			}
		});
	}
};

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
	renderActors(actorsArray);
});

// render actors form search resulte
const renderActors = async (actorsArray) => {
	// CONTAINER.innerHTML = '';
	const actorsList = document.createElement('div');
	actorsList.setAttribute('id', 'actors');
	actorsArray.map((actore) => {
		const actorAtag = document.createElement('div');
		actorAtag.innerHTML = `<p>${actore.name}</p>
      <img src="${
				actore.profile_path
					? BACKDROP_BASE_URL + actore.profile_path
					: './img/noImage.svg'
			}" alt = "${actore.name}" width = "200px"/>`;
		actorAtag.addEventListener('click', () => {
			renderActorDetails(actore.id);
		});
		actorsList.appendChild(actorAtag);
	});
	CONTAINER.appendChild(actorsList);
};

/****************  related movies ************** */

// Fetch related movies
const fetchRelatedMovies = async (movie_id) => {
	const url = constructUrl(`movie/${movie_id}/similar`);
	const res = await fetch(url);
	return res.json();
};

/**************** credits ************** */

// Fetch credits
const fetchCredits = async (movie_id) => {
	const url = constructUrl(`movie/${movie_id}/credits`);
	const res = await fetch(url);
	return res.json();
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
	let geners = await fetchGeners();
	geners.genres.map((gener) => {
		const generAtag = document.createElement('a');
		generAtag.setAttribute('class', 'dropdown-item');
		generAtag.innerText = `${gener.name}`;
		generAtag.setAttribute('value', `${gener.id}`);
		generAtag.addEventListener('click', async () => {
			let genreInfo = await fetchMoviesByGenres(gener.id);
			renderMovies(genreInfo.results);
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
	CONTAINER.innerHTML = '';
	const homepageDiv = document.createElement('div');
	homepageDiv.setAttribute('class', 'row text-center');
	CONTAINER.appendChild(homepageDiv);
	movies.map((movie) => {
		const movieDiv = document.createElement('div');
		movieDiv.setAttribute('class', 'col-md-4');
		movieDiv.innerHTML = `
        <img src="${
					movie.backdrop_path
						? BACKDROP_BASE_URL + movie.backdrop_path
						: './img/noImage.svg'
				}" alt="${movie.title} poster">
        <h6>${movie.title}</h6>`;
		movieDiv.addEventListener('click', () => {
			movieDetails(movie);
		});

		homepageDiv.appendChild(movieDiv);
	});
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (
	movie,
	trailerLink,
	credits,
	relatedMoveiCredits6,
	RelatedMovies
) => {
	let director = credits.crew.find((directorName) => {
		return directorName.job === 'Director';
	});

	CONTAINER.innerHTML = `
    <div class="row">	
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
								movie.backdrop_path
									? BACKDROP_BASE_URL + movie.backdrop_path
									: './img/noImage.svg'
							}>
        </div>
        <div class="col-md-8">
			<h1 id="movie-title">${movie.title}</h1>
			</br>
            <p id="movie-release-date"><b>Release Date:</b> ${
							movie.release_date
						}</p>
			<p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
			
			<img id="movie-production-company-logo" src='${
				movie.production_companies.length > 0
					? BACKDROP_BASE_URL + movie.production_companies[0].logo_path
					: './img/noImage.svg'
			}' width="100px"">
			<p id="movie-production-company"><b>production company:</b> ${
				movie.production_companies.length > 0
					? movie.production_companies[0].name
					: 'no logo'
			} Minutes</p>
			<p id="movie-language"><b>Movie Language:</b> ${movie.original_language}</p>
			<p id="movie-director "><b>Movie Director:</b> ${director.name}</p>
			<p id="movie-vote-average "><b>vote average:</b> ${movie.vote_average}</p>
			<p id="movie-vote-count "><b>vote count:</b> ${movie.vote_count}</p>
			</div>
			<div class='row'>
			<h3>Overview:</h3>
			<p id="movie-overview">${movie.overview}</p>
			<iframe width='560' height='315' src="${trailerLink.link}
			"></iframe>
		</div>
		</div>
		</br>
		
            <h3>Actors:</h3>
			<ul id="actors" class="list-unstyled row text-center"></ul>
			</br>
			<h3>Related Movies:</h3>
			<ul id="related-movie" class="list-unstyled row text-center"></ul>
	</div>`;
	//render credits
	const actorsList = document.getElementById('actors');
	relatedMoveiCredits6.map((actor) => {
		const actorAtag = document.createElement('li');
		actorAtag.setAttribute('class', 'col-lg-2 col-md-4 col-sm-6');
		actorAtag.innerHTML = `<p>${actor.name}</p>
      <img src="${
				actor.profile_path
					? BACKDROP_BASE_URL + actor.profile_path
					: './img/noImage.svg'
			}" alt = "${actor.name}" width = "150px"/>`;
		actorAtag.addEventListener('click', () => {
			renderActorDetails(actor.id);
		});
		actorsList.appendChild(actorAtag);
	});
	// render Realated movies

	const releatedMovieList = document.getElementById('related-movie');

	RelatedMovies.results.map((movie, index) => {
		if (index < 6) {
			const relatedMoviesDivtag = document.createElement('li');
			relatedMoviesDivtag.setAttribute('class', 'col-lg-2 col-md-4 col-sm-6');
			relatedMoviesDivtag.setAttribute('id', 'related-movie-div');
			relatedMoviesDivtag.innerHTML = `<p>${movie.title}</p>
			<img border="0" alt="${movie.title}" src="${
				movie.poster_path
					? BACKDROP_BASE_URL + movie.poster_path
					: './img/noImage.svg'
			}" width="100"/>
			`;
			relatedMoviesDivtag.addEventListener('click', () => {
				movieDetails(movie);
			});
			releatedMovieList.appendChild(relatedMoviesDivtag);
		}
	});
};

document.addEventListener('DOMContentLoaded', async function () {
	autorun('now_playing');
	renderGeners();
});


// document.addEventListener('DOMContentLoaded', async function () {
// 	autorun();
// 	renderGeners();
// });
