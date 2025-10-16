const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware per leggere il body JSON
app.use(express.json());

// Logger middleware: stampa su console e salva su file log.txt
app.use((req, res, next) => {
  const orario = new Date().toLocaleString();
  const log = `[${orario}] ${req.method} ${req.url}\n`;
  const fileLog = path.join(__dirname, "log.txt");

  try {
    fs.appendFileSync(fileLog, log, "utf8");
  } catch (err) {
    console.error("Errore scrittura log:", err);
  }

  console.log(log.trim());
  next();
});

// Rotta base
app.get("/", (req, res) => {
  res.json({ messaggio: "Server Express attivo!" });
});

// Rotta GET
app.get("/studenti", (req, res) => {
  res.json([{ nome: "Sara" }, { nome: "Nino" }]);
});

// Rotta POST
app.post("/studenti", (req, res) => {
  res.json({ messaggio: "Nuovo studente aggiunto!", body: req.body });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
