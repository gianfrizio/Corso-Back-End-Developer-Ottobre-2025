// queries.js - funzioni helper per interrogare i dataset
const genres = require('./genres');
const subgenres = require('./subgenres');
const films = require('./films');
const actors = require('./actors');
const directors = require('./directors');
const users = require('./users');
const joins = require('./joins');

// trova un film per id (ritorna l'oggetto film o null se non trovato)
function findFilmById(id) {
  return films.find(f => f.id === id) || null;
}

// ritorna tutti i film che appartengono a un dato genere
function findFilmsByGenre(genreId) {
  return films.filter(f => f.genreId === genreId);
}

// trova un attore per id
function findActorById(id) {
  return actors.find(a => a.id === id) || null;
}

// ritorna la lista di oggetti attore per uno specifico film
// prima prova a leggere l'array `actors` presente nel record del film,
// altrimenti usa la tabella di join `joins.actorFilm` come fallback
function findActorsForFilm(filmId) {
  const film = findFilmById(filmId);
  if (film && Array.isArray(film.actors)) {
    return film.actors.map(id => findActorById(id)).filter(Boolean);
  }
  // fallback: cerca nella tabella di join
  return joins.actorFilm.filter(j => j.filmId === filmId).map(j => findActorById(j.actorId)).filter(Boolean);
}

// trova un regista per id
function findDirectorById(id) {
  return directors.find(d => d.id === id) || null;
}

// trova tutti i film in cui ha recitato un dato attore (usa la tabella di join)
function findFilmsByActor(actorId) {
  const filmIds = joins.actorFilm.filter(j => j.actorId === actorId).map(j => j.filmId);
  return films.filter(f => filmIds.includes(f.id));
}

// trova tutti i film diretti da un dato regista
function findFilmsByDirector(directorId) {
  return films.filter(f => f.directorId === directorId);
}

// trova tutti i co-attori di un attore: tutti gli attori che hanno recitato in almeno
// un film insieme a `actorId` (esclude l'attore stesso)
function findCoActors(actorId) {
  // prendi i film dell'attore
  const filmIds = joins.actorFilm.filter(j => j.actorId === actorId).map(j => j.filmId);
  // prendi tutte le relazioni actorFilm per quei film e raccogli gli actorId unici
  const coActorIds = new Set();
  joins.actorFilm.forEach(j => {
    if (filmIds.includes(j.filmId) && j.actorId !== actorId) coActorIds.add(j.actorId);
  });
  return Array.from(coActorIds).map(id => findActorById(id)).filter(Boolean);
}

// trova un utente per id
function findUserById(id) {
  return users.find(u => u.id === id) || null;
}

// ritorna i film visti da un utente (controlla l'array `watched` dell'utente
// e, se vuoto, usa la tabella `joins.userFilm` come fallback)
function findUserWatchedFilms(userId) {
  const user = findUserById(userId);
  if (!user) return [];
  if (Array.isArray(user.watched) && user.watched.length) {
    return user.watched.map(id => findFilmById(id)).filter(Boolean);
  }
  // fallback: usa la tabella di join
  const filmIds = joins.userFilm.filter(j => j.userId === userId).map(j => j.filmId);
  return films.filter(f => filmIds.includes(f.id));
}

module.exports = {
  findFilmById,
  findFilmsByGenre,
  findActorById,
  findActorsForFilm,
  findDirectorById,
  findFilmsByActor,
  findFilmsByDirector,
  findCoActors,
  findUserById,
  findUserWatchedFilms,
  // espone tutti i dataset per eventuali usi diretti
  collections: { genres, subgenres, films, actors, directors, users, joins }
};
