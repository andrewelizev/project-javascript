// GitHub https://github.com/andrewelizev/project-javascript

// Project-javascript


window.onload = () => queryData(url);

const url = 'http://api.tvmaze.com/shows?page=0';

let queryData = async function(url, func) {
    let response = await fetch(url);
    let data;
    // console.log(response);
    if (response.ok) {
        data = await response.json();
        // console.log(data);

        if (data.length == 0) {
            showFindError();
            return;
        }

        if (func == showFavorites) {
            func(data);
        } else if (func == filmFilter) {
            filmFilter(data);
        } else {
            showFilms(data);
        }
    }
};

let linkAbout = document.getElementById('menu_about');
let linkFilms = document.getElementById('menu_films');
let linkFav = document.getElementById('menu_fav');
let linkContacts = document.getElementById('menu_contacts');
let pages = document.getElementById('filmsPerPage');
let searchBtn = document.getElementById('search_btn');

let storage = localStorage.getItem('favFilms');
if (storage.length == 0) {
    localStorage.setItem('favFilms', []);
}

linkFav.onclick = () => queryData(url, showFavorites);
linkAbout.onclick = showAbout;
linkFilms.onclick = () => queryData(url, showFilms);
linkContacts.onclick = showContacts;
pages.onchange = () => queryData(url, showFilms);
searchBtn.onclick = () => search();

// let arrFilms = queryData(url);

function showFilms(data) {
    const domTarget = document.getElementById('main');
    const mainTop = document.getElementById('main_top');
    const favFilms = localStorage.getItem('favFilms').split(',').map((item) => +item);
    let pages = document.getElementById('filmsPerPage').value;
    let filmsContainer = document.createElement('div');
    filmsContainer.classList.add('films');

    if (pages > data.length) {
        pages = data.length;
    }

    // console.log('data', data);

    for (let i = 0; i < pages; i++) {
        if (data[i]['show']) {
            data[i] = data[i].show;
        }
        let filmsCard = document.createElement('div');
        let filmsCardInner = document.createElement('div');
        let filmImg = document.createElement('img');
        let filmTitle = document.createElement('h4');
        let filmGenre = document.createElement('p');
        let filmLang = document.createElement('p');
        let filmDesc = document.createElement('div');
        let filmFav = document.createElement('div');

        filmsCard.classList.add('films_card');
        filmsCardInner.classList.add('films_card_inner');
        filmGenre.classList.add('film_genre');
        filmLang.classList.add('film_lang');
        filmDesc.classList.add('film_description');

        // console.log(data[i].id);
        // console.log(favFilms);

        if (favFilms.includes(data[i].id)) {
            filmFav.classList.add('film_fav_active');
        } else {
            filmFav.classList.add('film_fav');
        }
        filmImg.setAttribute('onclick', 'showThisFilm(this)');
        // filmsCardInner.setAttribute('onclick', 'showThisFilm(this)');
        filmFav.setAttribute('onclick', 'favorites(this)');
        filmsCard.setAttribute('id', data[i].id);

        if (!data[i].image) {
            filmImg.setAttribute('src', '/img/noimg.jpg');
        } else {
            filmImg.setAttribute('src', data[i].image.medium);
        }

        filmTitle.innerHTML = data[i].name;
        filmGenre.innerHTML = data[i].genres.join(', ');
        filmLang.innerHTML = data[i].language;
        filmDesc.innerHTML = data[i].summary;

        filmsCard.append(filmsCardInner);
        filmsCardInner.append(filmImg);
        filmsCardInner.append(filmTitle);
        filmsCardInner.append(filmGenre);
        filmsCardInner.append(filmLang);
        filmsCardInner.append(filmDesc);
        filmsCardInner.append(filmFav);

        filmsContainer.append(filmsCard);
    }

    domTarget.replaceChildren(filmsContainer);
}

function favorites(elem) {
    let curId = +elem.closest('div[id]').id;
    myFav = localStorage.getItem('favFilms').split(',').map((item) => +item);

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

function showFavorites(data) {
    const favFilms = localStorage.getItem('favFilms').split(',').map((item) => +item);
    let dataResult = data.filter((elem) => favFilms.includes(elem.id));

    // console.log('dataResult: ', dataResult);

    showFilms(dataResult);
}

function showAbout() {
    let sectionAbout = document.getElementById('main');
    let elem = document.createElement('div');

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

    elem.innerHTML = '<h2>Our contacts:</h2><h3><a href="https://github.com/VladRusanov/lessons">https://github.com/VladRusanov/lessons</a></h3><h3><a href="http://doc.a-level.com.ua/javascript">http://doc.a-level.com.ua/javascript</a></h3><h3><a href="https://naydyonovdanil.gitbook.io/javascript/">https://naydyonovdanil.gitbook.io/javascript/</a></h3>';
    sectionContacts.replaceChildren(elem);
}

function search() {
    let mainUrl = 'https://api.tvmaze.com';
    let searchStr = document.getElementById('form-search').value;
    if (searchStr == '') {
        // queryData(url, filmFilter);
        queryData(url);
    } else {
        let url = `${mainUrl}/search/shows?q=${searchStr}`;
        // queryData(url, filmFilter);
        queryData(url);
    }

}

function filmFilter(data) {
    let genre = document.getElementById('form_genre').value;
    let lang = document.getElementById('form-lang').value;

    console.log(data);
    console.log(genre);
    console.log(lang);

    let dataResult = data.filter(function (elem) {
        console.log('elem', elem);
        console.log('elem.genre', elem.genres);
        console.log('elem.language', elem.language);
        return elem.includes(elem.language == lang); // !!!!!!!!
    });

    console.log(dataResult);
}

function showThisFilm(elem) {
    let newElem = elem.closest('div[class]');

    if (!newElem.classList.contains('films_card-modal')) {
        newElem.classList.add('films_card-modal');
        newElem.classList.remove('films_card_inner');
    } else {
        newElem.classList.remove('films_card-modal');
        newElem.classList.add('films_card_inner');
    }
}