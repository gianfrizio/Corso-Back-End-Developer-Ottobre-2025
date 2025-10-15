const readline = require('readline');
const denunce = require('./lib/denunce');
const storage = require('./lib/storage');

// ------------------------------------------------------------------
// Inizializzazione directory e archiviazione automatica all'avvio
// ------------------------------------------------------------------
// Assicuriamoci che la struttura di cartelle e file esista
storage.ensureDirs();

// All'avvio eseguiamo l'archiviazione automatica (sposta denunce risolte e vecchie)
try {
  const moved = denunce.archiveOld();
  if (moved > 0) console.log(`Archiviate ${moved} denunce all'avvio.`);
} catch (e) {
  // Se qualcosa va storto non blocchiamo l'avvio, ma mostriamo l'errore
  console.error('Errore durante archiviazione automatica all\'avvio:', e.message);
}

// ------------------------------------------------------------------
// Interfaccia a riga di comando (readline)
// - Ogni voce del menu invoca una funzione che esegue l'operazione e poi ritorna al menu
// ------------------------------------------------------------------
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Wrap per usare rl.question con async/await
function question(q) { return new Promise(resolve => rl.question(q, ans => resolve(ans))); }

// Mostra il menu principale e gestisce la scelta utente
async function mainMenu() {
  console.log('\n=== Sistema Comunale Denunce ===');
  console.log('1) Aggiungi denuncia');
  console.log('2) Mostra tutte le denunce');
  console.log('3) Cerca');
  console.log('4) Segna come risolta');
  console.log('5) Rimuovi denuncia');
  console.log('6) Archivio automatico (controlla 30 giorni)');
  console.log('7) Genera report');
  console.log('0) Esci');
  const opt = await question('Scegli: ');
  switch(opt.trim()) {
    case '1': return addFlow();
    case '2': return showAll();
    case '3': return searchFlow();
    case '4': return resolveFlow();
    case '5': return removeFlow();
    case '6': return archiveFlow();
    case '7': return reportFlow();
    case '0': rl.close(); process.exit(0);
    default: console.log('Opzione non valida');
  }
  // Richiamiamo il menu in modo asincrono per evitare ricorsioni profonde
  setImmediate(mainMenu);
}

// Flusso per aggiungere una nuova denuncia (richiesta dati via readline)
async function addFlow() {
  const cittadino = await question('Cittadino: ');
  const tipo = await question('Tipo: ');
  const descrizione = await question('Descrizione: ');
  const quartiere = await question('Quartiere (Centro,Nord,Sud,Est,Ovest): ');
  const priorita = await question('Priorita (Alta,Media,Bassa): ');
  const res = denunce.addDenuncia({ cittadino, tipo, descrizione, quartiere, priorita });
  if (!res.success) console.log('Errore:', res.message);
  else console.log('Aggiunta:', res.denuncia);
  setImmediate(mainMenu);
}

// Mostra tutte le denunce esistenti (di tutti i quartieri)
function showAll() {
  const all = denunce.listAllDenunce();
  if (all.length === 0) console.log('\n\tj Nessuna denuncia trovata.');
  else console.table(all);
  setImmediate(mainMenu);
}

// Ricerca testuale su tutte le denunce
async function searchFlow() {
  const term = await question('Termine di ricerca: ');
  const res = denunce.search(term);
  console.table(res);
  setImmediate(mainMenu);
}

// Segna una denuncia come risolta (input: quartiere + id)
async function resolveFlow() {
  const quartiere = await question('Quartiere: ');
  const idS = await question('ID: ');
  const id = Number(idS);
  const res = denunce.markResolved(quartiere, id);
  console.log(res.success ? 'OK' : 'Errore: ' + res.message);
  setImmediate(mainMenu);
}

// Rimuove una denuncia per id nel quartiere specificato
async function removeFlow() {
  const quartiere = await question('Quartiere: ');
  const idS = await question('ID: ');
  const id = Number(idS);
  const res = denunce.removeDenuncia(quartiere, id);
  console.log(res.success ? 'Eliminata' : 'Errore: ' + res.message);
  setImmediate(mainMenu);
}

// Esegue l'archiviazione automatica (opzione 6)
function archiveFlow() {
  const count = denunce.archiveOld();
  console.log(`Archiviate ${count} denunce.`);
  setImmediate(mainMenu);
}

// Genera il report finale e lo stampa
function reportFlow() {
  const report = denunce.generateReport();
  console.log('Report generato:', report);
  setImmediate(mainMenu);
}

// Avvia il menu principale
mainMenu();
