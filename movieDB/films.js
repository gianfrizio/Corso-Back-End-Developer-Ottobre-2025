// films.js - collezione di film
// ogni film ha id, titolo, durata, anno, descrizione, riferimento a genere, regista e lista di attori
module.exports = [
  { id: 101, title: 'The Long Night', duration: 120, year: 1999, description: 'A moving drama.', genreId: 1, directorId: 201, actors: [301, 302] },
  { id: 102, title: 'Silent Whisper', duration: 95, year: 2005, description: 'Psychological drama.', genreId: 1, directorId: 202, actors: [303] },
  { id: 103, title: 'Love & Laughter', duration: 110, year: 2012, description: 'A lighthearted romantic comedy.', genreId: 2, directorId: 201, actors: [304] },
  { id: 104, title: 'Fast Strike', duration: 130, year: 2018, description: 'High-octane action.', genreId: 3, directorId: 203, actors: [305, 306] }
];
