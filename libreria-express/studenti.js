const express = require("express");
const app = express();

// Middleware per leggere JSON
app.use(express.json());

// Array in memoria per gli studenti
let studenti = [
  { id: 1, nome: "Mario Rossi", corso: "Informatica" },
  { id: 2, nome: "Giulia Bianchi", corso: "Matematica" },
  { id: 3, nome: "Luca Verdi", corso: "Informatica" },
];

// Rotta principale
app.get("/", (req, res) => {
  res.json({ messaggio: "Benvenuto nell'API degli Studenti!" });
});

// 01 - GET /studenti - Mostra tutti gli studenti
app.get("/studenti", (req, res) => {
  res.json(studenti);
});

// 02 - GET /studenti/:id - Mostra uno studente specifico
app.get("/studenti/:id", (req, res) => {
  const id = Number(req.params.id);
  const studente = studenti.find((s) => s.id === id);

  if (!studente) {
    return res.status(404).json({ errore: "Studente non trovato" });
  }

  res.json({ messaggio: "Studente trovato", studente });
});

// 03 - POST /studenti - Aggiunge un nuovo studente
app.post("/studenti", (req, res) => {
  const { nome, corso } = req.body;

  // Validazione input
  if (!nome || !corso) {
    return res.status(400).json({
      errore: "Nome e corso sono obbligatori"
    });
  }

  const nuovoStudente = {
    id: Date.now(),
    nome,
    corso
  };

  studenti.push(nuovoStudente);

  res.status(201).json({
    messaggio: "Studente aggiunto con successo",
    studente: nuovoStudente
  });
});

// 04 - PUT /studenti/:id - Aggiorna nome o corso
app.put("/studenti/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nome, corso } = req.body;
  const index = studenti.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ errore: "Studente non trovato" });
  }

  // Aggiorna solo i campi forniti
  if (nome) studenti[index].nome = nome;
  if (corso) studenti[index].corso = corso;

  res.json({
    messaggio: "Studente aggiornato con successo",
    studente: studenti[index]
  });
});

// 05 - DELETE /studenti/:id - Elimina studente
app.delete("/studenti/:id", (req, res) => {
  const id = Number(req.params.id);
  const lunghezzaIniziale = studenti.length;

  studenti = studenti.filter((s) => s.id !== id);

  if (studenti.length === lunghezzaIniziale) {
    return res.status(404).json({ errore: "Studente non trovato" });
  }

  res.json({ messaggio: `Studente con ID ${id} eliminato con successo` });
});

// BONUS - GET /ricerca?corso=Informatica - Ricerca studenti per corso
app.get("/ricerca", (req, res) => {
  const { corso } = req.query;

  // Validazione: parametro corso obbligatorio
  if (!corso) {
    return res.status(400).json({
      errore: "Il parametro 'corso' è obbligatorio",
      esempio: "/ricerca?corso=Informatica"
    });
  }

  // Filtra studenti per corso (case-insensitive)
  const risultati = studenti.filter(
    (s) => s.corso.toLowerCase() === corso.toLowerCase()
  );

  // Se nessuno studente corrisponde
  if (risultati.length === 0) {
    return res.status(404).json({
      errore: `Nessuno studente trovato per il corso "${corso}"`
    });
  }

  res.json({
    messaggio: `Trovati ${risultati.length} studenti per il corso "${corso}"`,
    studenti: risultati
  });
});

// Avvio del server
app.listen(3001, () => {
  console.log("Server Studenti in ascolto su http://localhost:3001");
  console.log("\nEndpoint disponibili:");
  console.log("  GET    /studenti           - Lista tutti gli studenti");
  console.log("  GET    /studenti/:id       - Dettagli studente");
  console.log("  POST   /studenti           - Aggiungi studente");
  console.log("  PUT    /studenti/:id       - Aggiorna studente");
  console.log("  DELETE /studenti/:id       - Elimina studente");
  console.log("  GET    /ricerca?corso=...  - Ricerca per corso (BONUS)");
});
