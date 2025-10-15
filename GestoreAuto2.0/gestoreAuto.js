// gestoreAuto.js - Esercizio GestoreAuto2.0

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'auto.json');

try {
  // Controllo di sicurezza: verifico che il file esista prima di leggerlo
  if (!fs.existsSync(FILE)) {
    console.log(`Il file ${FILE} non esiste. Crealo prima di eseguire questo script.`);
    process.exit(0);
  }

  // Leggi e converte
  const raw = fs.readFileSync(FILE, 'utf8');
  console.log('File letto:');
  console.log(raw);

  const auto = JSON.parse(raw);
  console.log('\nOggetto letto:');
  console.log(auto);

  // Aggiungi nuovi campi
  auto.targa = 'AB123CD';
  auto.alimentazione = 'Benzina';
  console.log('\nDopo aggiunta campi:');
  console.log(auto);

  // Aggiorna il colore
  console.log('\nAggiorno il colore da Rosso a Blu');
  auto.colore = 'Blu';
  console.log(auto);

  // Rimuovi il campo anno
  console.log('\nRimuovo il campo anno');
  delete auto.anno;
  console.log(auto);

  // Aggiungi un optional
  console.log('\nAggiungo optional "bluetooth"');
  if (!Array.isArray(auto.optional)) auto.optional = [];
  auto.optional.push('bluetooth');
  console.log(auto);

  // Riscrivi il file
  fs.writeFileSync(FILE, JSON.stringify(auto, null, 2), 'utf8');
  console.log('\n✅ File aggiornato con successo!');

  // Stampa oggetto finale
  console.log('\nOggetto finale:');
  console.log(auto);

} catch (err) {
  console.error('Errore:', err.message);
}
