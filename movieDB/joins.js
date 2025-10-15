// joins.js - esempi di tabelle di join esplicite
// contiene relazioni actor<->film e user<->film per esempi di query
module.exports = {
  actorFilm: [
    { id: 1, actorId: 301, filmId: 101 },
    { id: 2, actorId: 302, filmId: 101 },
    { id: 3, actorId: 303, filmId: 102 },
    { id: 4, actorId: 304, filmId: 103 },
    { id: 5, actorId: 305, filmId: 104 },
    { id: 6, actorId: 306, filmId: 104 }
  ],

  // tabella di join user<->film per tracciare i film visti
  userFilm: [
    { id: 1, userId: 401, filmId: 101 },
    { id: 2, userId: 402, filmId: 102 }
  ]
};
