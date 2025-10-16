# Logger personalizzato (Express)

Esempio guidato per creare un middleware logger in Express che registra metodo, URL e orario di ogni richiesta e salva i log su `log.txt`.

Istruzioni rapide:

1. Installa le dipendenze

```bash
npm install
```

2. Avvia il server

```bash
npm start
```

3. Prova le rotte

GET http://localhost:3001/
GET http://localhost:3001/studenti
POST http://localhost:3001/studenti  (body JSON)

I log verranno aggiunti a `log.txt` nella cartella del progetto e stampati in console.
