// Importiamo il modulo http di Node
const http = require("http");

const PORT = 3000;

// Creiamo il server (unica istanza) e gestiamo sia richieste GET con JSON che le altre con testo
const server = http.createServer((req, res) => {
  console.log("Metodo:", req.method);
  console.log("URL:", req.url);
  console.log("Header:", req.headers);

  if (req.method === "GET") {
    const risposta = { messaggio: "Hai inviato una GET" };
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(risposta));
    return;
  }

  // Default response per altri metodi
  res.statusCode = 200; // Codice 200 = OK
  res.setHeader("Content-Type", "text/plain"); // Tipo di contenuto: testo
  res.end("Richiesta ricevuta! Controlla la console del server.\n"); // Risposta
});

server.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});