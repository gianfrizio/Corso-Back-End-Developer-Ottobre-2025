const express = require("express");
const app = express();

// Middleware per leggere JSON
app.use(express.json());

// Array in memoria per i libri
let libri = [
  { id: 1, titolo: "1984", autore: "George Orwell" },
  { id: 2, titolo: "Il Signore degli Anelli", autore: "J.R.R. Tolkien" },
];

// STEP 2: Rotta principale
app.get("/", (req, res) => {
  res.json({ messaggio: "Benvenuto nella Libreria Express!" });
});

// STEP 3: Leggere tutti i libri
app.get("/libri", (req, res) => {
  res.json(libri);
});

// STEP 4: Leggere un singolo libro con params
app.get("/libri/:id", (req, res) => {
  const id = Number(req.params.id);
  const libro = libri.find((l) => l.id === id);

  if (!libro) {
    return res.status(404).json({ errore: "Libro non trovato" });
  }

  res.json({ messaggio: "Libro trovato", libro });
});

// STEP 5: Aggiungere un libro con body
app.post("/libri", (req, res) => {
  const { titolo, autore } = req.body;

  if (!titolo || !autore) {
    return res.status(400).json({
      errore: "Titolo e autore sono obbligatori"
    });
  }

  const nuovoLibro = {
    id: Date.now(),
    titolo,
    autore
  };

  libri.push(nuovoLibro);

  res.status(201).json({
    messaggio: "Libro aggiunto",
    libro: nuovoLibro
  });
});

// STEP 6: Aggiornare un libro
app.put("/libri/:id", (req, res) => {
  const id = Number(req.params.id);
  const { titolo, autore } = req.body;
  const index = libri.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ errore: "Libro non trovato" });
  }

  if (titolo) libri[index].titolo = titolo;
  if (autore) libri[index].autore = autore;

  res.json({ messaggio: "Libro aggiornato", libro: libri[index] });
});

// STEP 6: Cancellare un libro
app.delete("/libri/:id", (req, res) => {
  const id = Number(req.params.id);
  const iniziale = libri.length;

  libri = libri.filter((l) => l.id !== id);

  if (libri.length === iniziale) {
    return res.status(404).json({ errore: "Libro non trovato" });
  }

  res.json({ messaggio: `Libro con ID ${id} eliminato` });
});

// Avvio del server
app.listen(3000, () => {
  console.log("Server in ascolto su http://localhost:3000");
});
