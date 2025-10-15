// TextToObject - esercizio

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'prodotti.json');

/**
 * Legge un file JSON e lo converte in oggetto JS
 * Ritorna un oggetto { raw, parsed }
 */
function leggiProdotti(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  return { raw, parsed };
}

try {
  console.log('1) Creazione File iniziale');
  // file creato già con create_file, ma assicuriamoci
  fs.writeFileSync(FILE, '{ "nome": "Caffè", "prezzo": 1.2 }', 'utf8');
  console.log('File prodotti.json creato con successo nella directory di lavoro');

  console.log('\n2) Lettura contenuto');
  const { raw: testo, parsed } = leggiProdotti(FILE);
  let data = parsed; // usa let perché potremmo trasformare l'oggetto in array
  console.log('Testo letto dal file:', testo);

  console.log('\n3) Conversione in oggetto');
  console.log('Oggetto JavaScript:', data);

  console.log('\n4) Espandi l\'archivio (aggiungi Tè e Latte)');
  // Se il file conteneva un singolo oggetto, trasformalo in array
  if (!Array.isArray(data)) {
    data = [data];
  }

  data.push({ "nome": "Tè", "prezzo": 1.0 });
  data.push({ "nome": "Latte", "prezzo": 1.5 });

  console.log('File modificato e salvato con i nuovi dati');
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');

  console.log('\n5) Conferma finale');
  const { raw: nuovoContenuto, parsed: prodotti } = leggiProdotti(FILE);
  console.log('Nuovo contenuto:', nuovoContenuto);

  console.log('\nProdotti disponibili:');
  prodotti.forEach(p => {
    console.log(`- ${p.nome}: ${p.prezzo} €`);
  });

} catch (err) {
  console.error('Errore durante l\'esecuzione:', err);
}
