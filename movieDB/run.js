// run.js - demo rapido per mostrare l'utilizzo delle query
const q = require('./queries');

console.log('--- Find film by id 101 ---');
console.log(q.findFilmById(101));

console.log('\n--- Actors for film 101 ---');
console.log(q.findActorsForFilm(101));

console.log('\n--- Films in genre 1 (Drama) ---');
console.log(q.findFilmsByGenre(1).map(f => f.title));

console.log('\n--- Films for actor 305 ---');
console.log(q.findFilmsByActor(305).map(f => f.title));

console.log('\n--- Films watched by user 401 ---');
console.log(q.findUserWatchedFilms(401).map(f => f.title));

console.log('\n--- Films directed by director 201 ---');
console.log(q.findFilmsByDirector(201).map(f => f.title));

console.log('\n--- Co-actors for actor 301 ---');
console.log(q.findCoActors(301).map(a => `${a.firstName} ${a.lastName}`));
