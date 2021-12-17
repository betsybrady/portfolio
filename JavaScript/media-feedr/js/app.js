// Get keys
import {boardGameKey} from './keys.js';
import {videoGameKey} from './keys.js';
import {movieKey} from './keys.js';

// set URLs
const boardGameGenreURL = new URL('https://api.boardgameatlas.com/api/game/categories?client_id=' + boardGameKey);
const movieGenreURL = new URL('https://api.themoviedb.org/3/genre/movie/list?api_key=' + movieKey);
const boardGameURL = new URL('https://api.boardgameatlas.com/api/search?limit=100&client_id=' + boardGameKey);
const videoGameURL1 = new URL('https://api.rawg.io/api/games?page_size=20&page=1&key=' + videoGameKey);
const videoGameURL2 = new URL('https://api.rawg.io/api/games?page_size=20&page=2&key=' + videoGameKey);
const videoGameURL3 = new URL('https://api.rawg.io/api/games?page_size=20&page=3&key=' + videoGameKey);
const videoGameURL4 = new URL('https://api.rawg.io/api/games?page_size=20&page=4&key=' + videoGameKey);
const videoGameURL5 = new URL('https://api.rawg.io/api/games?page_size=20&page=5&key=' + videoGameKey);
const movieURL1 = new URL('https://api.themoviedb.org/3/discover/movie?page=1&api_key=' + movieKey);
const movieURL2 = new URL('https://api.themoviedb.org/3/discover/movie?page=2&api_key=' + movieKey);
const movieURL3 = new URL('https://api.themoviedb.org/3/discover/movie?page=3&api_key=' + movieKey);
const movieURL4 = new URL('https://api.themoviedb.org/3/discover/movie?page=4&api_key=' + movieKey);
const movieURL5 = new URL('https://api.themoviedb.org/3/discover/movie?page=5&api_key=' + movieKey);


let sources = [boardGameURL, videoGameURL1, videoGameURL2, videoGameURL3, videoGameURL4, videoGameURL5, 
movieURL1, movieURL2, movieURL3, movieURL4, movieURL5];

// DOM elements
let mainSection = document.getElementById('articles-main');
let loaderElem = document.getElementById('loader');

// Track values
let numLoaded = 0;
let sortedBy = 'Rating';
let filteredBy = 'All';

// request function
async function makeRequest(url) {
  try {
    const rawResponse = await fetch(url);

    if (!rawResponse.ok) {
      throw new Error(rawResponse.message);
    }

    const jsonResponse = await rawResponse.json();

    // console.log('jsonResponse', jsonResponse);
    return jsonResponse;
  } catch (err) {
    console.error('ERROR', err);
  }
}

// sets pop up
async function popUpDOM(data) {
  let popUpElem = document.getElementById('popUp');
  let popUpTitle = document.getElementById('popUp-title');
  let popUpDescrip = document.getElementById('popUp-descrip');
  let popUpLink = document.getElementById('popUp-link');
  let popUpImage = document.getElementById('popUp-image');
  let closePopUp = document.getElementById('close-popUp');

  popUpTitle.textContent = data.name;

  // avoids unnecessary API calls
  if (typeof(data.description) === 'number') {
    popUpDescrip.textContent = await videoGameDescrip(data.description);
  }
  else {
    popUpDescrip.textContent = data.description;
  }

  popUpLink.setAttribute('href', data.url);
  popUpImage.setAttribute('src', data.image);

  popUpElem.classList.remove('loader', 'hidden');
  

  closePopUp.onclick = ((event) => {
    event.preventDefault();
    popUpElem.classList.add('loader', 'hidden');
  });
}

// builds article DOM
function articleDOM(data) {
  loaderElem.classList.add('hidden');

  // make article
  let articleElem = document.createElement('article');
  articleElem.className = 'article';
  articleElem.innerHTML = `<section class='featuredImage'>
    <img src=${data.image} alt='' />
  </section>
  <section class='articleContent'>
      <a id="article-link" href='#'><h3>${data.name}</h3></a>
      <h6>${data.media} - ${data.genres}</h6>
  </section>
  <section class='impressions'>${data.rating}</section>
  <div class='clearfix'></div>`;
  mainSection.appendChild(articleElem);
  numLoaded++;
  // add pop up link to article
  let articleLink = document.getElementById('article-link');
  articleLink.removeAttribute('id');
  articleLink.onclick = (event) => {
    event.preventDefault();
    popUpDOM(data);
  };
}

// gets list of ids for genre names for board games
async function boardGameGenresInit() {
  // Get board game genres
  let boardGameGenres = await makeRequest(boardGameGenreURL);
  boardGameGenres = boardGameGenres.categories;
  return boardGameGenres;
}

// gets list of ids for genre names
async function movieGenresInit() {
  // Get movie genres
  let movieGenres = await makeRequest(movieGenreURL);
  movieGenres = movieGenres.genres;
  return movieGenres;
}

// translates genre ids to genre list
function genres(ids, list) {
  // Get genre list
  let genreList = '';
  for (let i = 0; i < ids.length; i++) {
    let genre = list.find(x => {
      return x.id === ids[i] || x.id === ids[i].id;
    });
    if (genre) {
      genreList += (genre.name + ((i < ids.length - 1) ? ', ' : ''));
    }
  }
  return genreList;
}

// api call to get video game description
async function videoGameDescrip(id) {
  let descripCall = await makeRequest(`https://api.rawg.io/api/games/${id}?key=${videoGameKey}`);
  let description = descripCall.description;
  return HTMLtoText(description);
}

// turns html into plain text - avoids potential formatting issues
function HTMLtoText(text) {
  text = text.replace(/&#39;/g, '"');
  text = text.replace(/<[^>]+>/g, '');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&quot;/g, '"');
  return text;
}

// scrolls to top
function scrollTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// translates json into normalized objects
async function normalizeData(data) {
  let boardGameGenreList = await boardGameGenresInit();
  let movieGenreList = await movieGenresInit();

  function DataObj(name, media, image, genres, url, rating, description) {
    this.name = name;
    this.media = media;
    this.image = image;
    this.genres = genres;
    this.url = url;
    this.rating = rating;
    this.description = description;
  }
  let cleanData = [];

  for (let i = 0; i < data.length; i++) {
    // board game
    if (i === 0) {
      for (let j = 0; j < data[i].games.length; j++) {
        let game = data[i].games[j];
        cleanData.push(new DataObj(game.name, 'Board Game', game.image_url, await genres(game.categories, boardGameGenreList), 
        game.url, game.average_user_rating.toFixed(2), HTMLtoText(game.description), ''));
      }
    }
    // video game
    if (i >= 1 && i <= 5) {
      for (let j = 0; j < data[i].results.length; j++) {
        let game = data[i].results[j];
        let genreList = '';
        for (let i = 0; i < game.genres.length; i++) {
          genreList += (game.genres[i].name + ((i < game.genres.length - 1) ? ', ' : ''));
        }
        cleanData.push(new DataObj(game.name, 'Video Game', game.background_image, genreList, 
        ('https://rawg.io/games/' + game.slug), game.rating.toFixed(2), game.id));
        // console.log(game);
      }
    }
    // movie
    if (i > 5) {
      for (let j = 0; j < data[i].results.length; j++) {
        let movie = data[i].results[j];
        let movieTitleURL = movie.title.toLowerCase().replace(/[^a-z0-9+]+/gi, '-');
        cleanData.push(new DataObj(movie.title, 'Movie', `https://www.themoviedb.org/t/p/w1280${movie.poster_path}`,
        await genres(movie.genre_ids, movieGenreList), `https://www.themoviedb.org/movie/${movie.id}-${movieTitleURL}`, (movie.vote_average/2).toFixed(2), movie.overview));
      }
    }
  }
  cleanData.sort(function(a, b) {
    return b.rating - a.rating;
  });
  return cleanData;
}

// changes sorting of media
function sortMedia(element, tag, data, sortElem) {

  while (mainSection.firstChild) {
    mainSection.removeChild(mainSection.firstChild);
  }
  numLoaded = 0;
  loaderElem.classList.remove('hidden');

  if (tag === 'Name') {      
    data.sort(function(a, b) {
      if (a[element] < b[element]) { 
        return -1; 
      }
      if (a[element] > b[element]) { 
        return 1; 
      }
      return 0;
    });
  }
  else {
    data.sort(function(a, b) {
      return b[element] - a[element];
    });
  }

  for (let i = 0; i < 20; i++) {
    articleDOM(data[i]);
  }

  if (sortedBy === tag) {
    return data;
  }
  else {
    scrollTop();
    sortedBy = tag;
    sortElem.textContent = tag;
    return data;
  }

}

// filters media by type
function filterMedia(tag, data, allData, filterElem, sortElem) {
  while (mainSection.firstChild) {
    mainSection.removeChild(mainSection.firstChild);
  }
  numLoaded = 0;
  loaderElem.classList.remove('hidden');

  if (tag === 'All') {
    data = allData;
  }
  else {
    data = allData.filter((x) => {
      if (x.media === tag) {
        return x;
      }
    });
  }
  data = sortMedia(sortedBy.toLowerCase(), sortedBy, data, sortElem);

  for (let i = 0; i < 20; i++) {
    articleDOM(data[i]);
  }

  if (filteredBy === tag) {
    return data;
  }
  else {
    scrollTop();
    filteredBy = tag;
    filterElem.textContent = tag;
    return data;
  }
}

// filters by search query
function searchMedia(query, data, allData, noResults) {
  while (mainSection.firstChild) {
    mainSection.removeChild(mainSection.firstChild);
  }
  numLoaded = 0;
  loaderElem.classList.remove('hidden');

  if (query === '') {
    data = allData;
  }

  else {
    data = allData.filter((x) => {
      if ((x.name.toLowerCase()).includes(query)) {
        return x;
      }
    });
  }

  if (data.length === 0) {
    // alert('No results found!');
    noResults.classList.remove('hidden');
    loaderElem.classList.add('hidden');

    scrollTop();
    return data;
  }
  else {
    noResults.classList.add('hidden');
    for (let i = 0; i < 20 && i < data.length; i++) {
      articleDOM(data[i]);
    }
  
    scrollTop();
    return data;
  }
}

// loads data
async function init(sources) {
  // Gets promises
  let promises = [];
  for (let i = 0; i < sources.length; i++) {
    promises.push(makeRequest(sources[i]));
  }

  // Waits for promises to be fulfilled
  const data = await Promise.all(promises);

  // normalize, have data in a more predicatable fashion since all api data is different
  let cleanData = await normalizeData(data);

  return cleanData;

}

// handles loaded page + user interactions
async function onLoadHandler() {
  let cleanData = await init(sources);

  for (let i = 0; i < 20; i++) {
    articleDOM(cleanData[i]);
  }

  window.onscroll = function() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        if (numLoaded < cleanData.length - 1) {
          let oldNum = numLoaded;
          for (let i = oldNum; (i < oldNum + 20 && i < cleanData.length - 1); i++) {
            articleDOM(cleanData[i]);
          }
        }
    }
  };

  // sort by title or rating
  let allCleanData = cleanData;

  let sortElem = document.getElementById('sort');
  let sortName = document.getElementById('sort-name');
  let sortRating = document.getElementById('sort-rating');

  sortName.onclick = (event) => {
    event.preventDefault();
    cleanData = sortMedia('name', 'Name', cleanData, sortElem);
  };

  sortRating.onclick = (event) => {
    event.preventDefault();
    cleanData = sortMedia('rating', 'Rating', cleanData, sortElem);
  };

  // filter
  let filterElem = document.getElementById('filter');
  let filterBoardGames = document.getElementById('filter-board-games');
  let filterVideoGames = document.getElementById('filter-video-games');
  let filterMovies = document.getElementById('filter-movies');
  let filterAll = document.getElementById('filter-all');

  filterBoardGames.onclick = (event) => {
    event.preventDefault();
    cleanData = filterMedia('Board Game', cleanData, allCleanData, filterElem, sortElem);
  };

  filterVideoGames.onclick = (event) => {
    event.preventDefault();
    cleanData = filterMedia('Video Game', cleanData, allCleanData, filterElem, sortElem);
  };

  filterMovies.onclick = (event) => {
    event.preventDefault();
    cleanData = filterMedia('Movie', cleanData, allCleanData, filterElem, sortElem);
  };

  filterAll.onclick = (event) => {
    event.preventDefault();
    cleanData = filterMedia('All', cleanData, allCleanData, filterElem, sortElem);
  };

  // reset search/filter
  let homeButton = document.getElementById('home');
  homeButton.onclick = (event) => {
    event.preventDefault();
    cleanData = filterMedia('All', cleanData, allCleanData, filterElem, sortElem);
    cleanData = sortMedia('rating', 'Rating', cleanData, sortElem);
    searchDiv.classList.remove('active');
    searchBar.value = '';
    cleanData = searchMedia(searchBar.value, cleanData, allCleanData, noResults);
    scrollTop();
  };

  // search
  let searchLink = document.getElementById('search-link');
  let searchBar = document.getElementById('search-bar');
  let searchDiv = document.getElementById('search');
  let noResults = document.getElementById('no-results');

  searchLink.onclick = (event) => {
    event.preventDefault();
    searchDiv.classList.toggle('active');
    searchBar.value = '';
    cleanData = filterMedia('All', cleanData, allCleanData, filterElem, sortElem);
    cleanData = sortMedia('rating', 'Rating', cleanData, sortElem);
    cleanData = searchMedia(searchBar.value, cleanData, allCleanData, noResults);
  };

  searchBar.onkeyup = (event) => {
    cleanData = filterMedia('All', cleanData, allCleanData, filterElem, sortElem);
    cleanData = sortMedia('rating', 'Rating', cleanData, sortElem);
    cleanData = searchMedia(searchBar.value, cleanData, allCleanData, noResults);
  };

}

// only run onLoadHandler if DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onLoadHandler);

} else {
  onLoadHandler();
}
