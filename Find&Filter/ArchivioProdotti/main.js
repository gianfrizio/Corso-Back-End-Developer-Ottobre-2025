const fs = require('fs').promises;
const path = require('path');

// Percorso al file prodotti.json nella stessa cartella
const filePath = path.join(__dirname, 'prodotti.json');

async function main() {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const prodotti = JSON.parse(raw);

    // 2) find() per cercare il prodotto "Latte"
    const latte = prodotti.find(p => p.nome === 'Latte');

    // 3) filter() per prodotti con prezzo > 1.2
    const costosi = prodotti.filter(p => p.prezzo > 1.2);

    // 4) Stampa i risultati
    console.log('Prodotto trovato con find():');
    console.log(latte || 'Prodotto "Latte" non trovato');
    console.log('\nProdotti con prezzo > 1.2:');
    console.log(costosi);
  } catch (err) {
    console.error('Errore durante la lettura o parsing del file:', err.message);
    process.exit(1);
  }
}

main();
