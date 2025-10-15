// users.js - elenco degli utenti
// ogni utente include i film visti (watched) e informazioni sul join con i film
module.exports = [
  { id: 401, name: 'Gianni', surname: 'Ferrari', birthYear: 1990, watched: [101], joinFilms: [ { filmId: 101, rating: 5, comment: 'Great!' } ] },
  { id: 402, name: 'Lucia', surname: 'Conti', birthYear: 1988, watched: [], joinFilms: [] }
];
