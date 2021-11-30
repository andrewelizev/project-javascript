// GitHub https://github.com/andrewelizev/project-javascript

// Project-javascript


window.onload = () => {
    init();
	queryData(url);
};

const url = 'http://api.tvmaze.com/shows?page=0';
const mainTop = document.getElementById('main_top');

let queryData = async function(url, func) {
    let response = await fetch(url);
    let data;
    let handledData;
    // console.log(response);
    if (response.ok) {
        data = await response.json();
        // console.log(data);

        if (data.length == 0) {
            showFindError();
            return;
        }

        if (func) {
           handledData = func(data);
        }

        showFilms(handledData || data);
    }
};

function init() {
	let linkAbout = document.getElementById('menu_about');
	let linkFilms = document.getElementById('menu_films');
	let linkFav = document.getElementById('menu_fav');
	let linkContacts = document.getElementById('menu_contacts');
	let pages = document.getElementById('filmsPerPage');
	let searchBtn = document.getElementById('search_btn');
	let storage = localStorage.getItem('favFilms');

	if (!storage) {
		localStorage.setItem('favFilms', '');
	}

	linkFav.onclick = () => queryData(url, showFavorites);
	linkAbout.onclick = showAbout;
	linkFilms.onclick = () => queryData(url, showFilms);
	linkContacts.onclick = showContacts;
	pages.onchange = () => queryData(url, showFilms);
	searchBtn.onclick = () => search();
}

function showFilms(data) {
    const domTarget = document.getElementById('main');
    const mainTop = document.getElementById('main_top');
	const favFilmsStorage = localStorage.getItem('favFilms');
	mainTop.classList.remove('hide');
    let favFilms;

	if (favFilmsStorage) {
		favFilms = favFilmsStorage.split(',').map((item) => +item);
	}
    let filmsPerPage = document.getElementById('filmsPerPage').value;
    let filmsContainer = document.createElement('div');
    filmsContainer.classList.add('films');

    if (filmsPerPage > data.length) {
        filmsPerPage = data.length;
    }

    data.forEach((film, index) => {
		if (index >= filmsPerPage) {
			return;
		}

		// let dataToShow = [];
        if (film.show) {
            film = film.show;
        }
        let filmsCardWrapper = document.createElement('div');
        let filmsCard = document.createElement('div');
        let filmsCardInner = document.createElement('div');
        let filmImg = document.createElement('img');
        let filmTitle = document.createElement('h4');
        let filmGenre = document.createElement('p');
        let filmLang = document.createElement('p');
        let filmDesc = document.createElement('div');
        let filmFav = document.createElement('div');
        let filmCardCloseBtn = document.createElement('div');

        filmsCardWrapper.classList.add('films_card_wrapper');
        filmsCard.classList.add('films_card');
        filmsCardInner.classList.add('films_card_inner');
        filmGenre.classList.add('film_genre');
        filmLang.classList.add('film_lang');
        filmDesc.classList.add('film_description');
        filmCardCloseBtn.classList.add('close_img');

		filmsCardWrapper.onclick = (event) => showThisFilm(event.target.previousSibling.firstChild);
        filmCardCloseBtn.onclick = (event) => showThisFilm(event.target.closest('div[id]').firstChild);

		if (favFilms && favFilms.includes(film.id)) {
			filmFav.classList.add('film_fav_active');
		} else {
			filmFav.classList.add('film_fav');
		}
        filmImg.setAttribute('onclick', 'showThisFilm(this)');
        filmFav.setAttribute('onclick', 'favorites(this)');
        filmsCard.setAttribute('id', film.id);

        if (!film.image) {
            filmImg.setAttribute('src', './img/noimg.jpg');
        } else {
            filmImg.setAttribute('src', film.image.medium);
        }

        filmTitle.innerHTML = film.name;
        filmGenre.innerHTML = film.genres.join(', ');
        filmLang.innerHTML = film.language;
        filmDesc.innerHTML = film.summary;

        filmsCard.append(filmsCardInner);
        filmsCardInner.append(filmImg);
        filmsCardInner.append(filmTitle);
        filmsCardInner.append(filmGenre);
        filmsCardInner.append(filmLang);
        filmsCardInner.append(filmDesc);
        filmsCardInner.append(filmFav);
        filmsCardInner.append(filmCardCloseBtn);

        filmsContainer.append(filmsCard);
        filmsContainer.append(filmsCardWrapper);
    });


    domTarget.replaceChildren(filmsContainer);
}

function favorites(elem) {
    let curId = +elem.closest('div[id]').id;
	const favFilmsStorage = localStorage.getItem('favFilms');

	myFav = favFilmsStorage.split(',').map((item) => +item);

    if (elem.classList.contains('film_fav')) {
        elem.classList.remove('film_fav');
        elem.classList.add('film_fav_active');

        myFav.push(curId);

    } else if (elem.classList.contains('film_fav_active')) {
        elem.classList.remove('film_fav_active');
        elem.classList.add('film_fav');

        myFav = myFav.filter((item) => +item != curId);
    }

    localStorage.setItem('favFilms', myFav);
}

function showFavorites() {
	// TODO: request each film by id
	const favFilmsStorage = localStorage.getItem('favFilms');
    let favFilms;
    let favFilmQuery = [];
    let url = 'https://api.tvmaze.com/shows/';

	if (favFilmsStorage) {
		favFilms = favFilmsStorage.split(',').map((item) => +item);
		// console.log('favFilms: ', favFilms);
	}

    const favoriteFilms = async () => {

        favFilms.forEach((elem) => {
            urlFav = `${url}${elem}`;
            favFilmQuery.push(fetch(urlFav));
        });

        let result = await Promise.all(favFilmQuery);
        let dataResult = await Promise.all(result.map(film => film.json()));

        showFilms(dataResult);
    };

    favoriteFilms();
}

function showAbout() {
    let sectionAbout = document.getElementById('main');
    let elem = document.createElement('div');
    mainTop.classList.add('hide');
    elem.innerHTML = '<h2>Find episode information for any show on any device. anytime, anywhere!</h2>';
    sectionAbout.replaceChildren(elem);
}

function showFindError() {
    let sectionError = document.getElementById('main');
    let elem = document.createElement('div');
    let searchStr = document.getElementById('form-search').value;

    elem.innerHTML = `<h1>Films result for «${searchStr}» not found :(</h1>`;
    sectionError.replaceChildren(elem);

    document.getElementById('form-search').value = '';
}

function showContacts() {
    let sectionContacts = document.getElementById('main');
    let elem = document.createElement('div');
    mainTop.classList.add('hide');
    elem.innerHTML = '<h2>Our contacts:</h2><h3><a href="https://github.com/VladRusanov/lessons">https://github.com/VladRusanov/lessons</a></h3><h3><a href="http://doc.a-level.com.ua/javascript">http://doc.a-level.com.ua/javascript</a></h3><h3><a href="https://naydyonovdanil.gitbook.io/javascript/">https://naydyonovdanil.gitbook.io/javascript/</a></h3>';
    sectionContacts.replaceChildren(elem);
}

function search() {
    let mainUrl = 'https://api.tvmaze.com';
    let searchStr = document.getElementById('form-search').value;

    if (searchStr == '') {
        queryData(url, filmFilter);
    } else {
        let url = `${mainUrl}/search/shows?q=${searchStr}`;
        queryData(url, filmFilter);
    }

}

function filmFilter(data) {
    let genre = document.getElementById('form_genre').value;
    let lang = document.getElementById('form-lang').value;

	if (genre || lang) {
        console.log(data);

        return data.filter(function (elem) {
            if (elem.show) {
                elem = elem.show;
            }
			if (!genre && lang) {
                return elem.language == lang;
            } else if (genre && !lang) {
                return elem.genres.includes(genre);
            } else {
                return elem.language === lang && elem.genres.includes(genre);
            }
		});
	}
    console.log(data);

    return data;
}

function showThisFilm(elem) {
    let newElem = elem.closest('div[class]');

    if (!newElem.classList.contains('films_card-modal')) {
        newElem.classList.add('films_card-modal');
        newElem.classList.remove('films_card_inner');
		newElem.parentElement.nextSibling.classList.add('modal_wrapper');
		newElem.parentElement.nextSibling.classList.remove('films_card_wrapper');
    } else {
        newElem.classList.remove('films_card-modal');
        newElem.classList.add('films_card_inner');
		newElem.parentElement.nextSibling.classList.remove('modal_wrapper');
		newElem.parentElement.nextSibling.classList.add('films_card_wrapper');
    }
}