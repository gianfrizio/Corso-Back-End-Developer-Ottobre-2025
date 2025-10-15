const fs = require('fs');
const path = require('path');

// Percorsi principali dei dati
const dataDir = path.join(__dirname, '..', 'data');
const quartieriDir = path.join(dataDir, 'quartieri');
const archiveFile = path.join(dataDir, 'archive.json');
const logFile = path.join(dataDir, 'log.txt');

// Assicura che le cartelle e i file necessari esistano
function ensureDirs() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  if (!fs.existsSync(quartieriDir)) fs.mkdirSync(quartieriDir);
  if (!fs.existsSync(archiveFile)) fs.writeFileSync(archiveFile, '[]', 'utf8');
  if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, '', 'utf8');
  // Assicura che report.json esista con un valore predefinito sensato
  const reportFile = path.join(dataDir, 'report.json');
  if (!fs.existsSync(reportFile)) fs.writeFileSync(reportFile, JSON.stringify({ generatedAt: null, summary: {} }, null, 2), 'utf8');
  // Assicura che i file dei quartieri esistano
  const defaultQuartieri = ['Centro', 'Nord', 'Sud', 'Est', 'Ovest'];
  defaultQuartieri.forEach(q => {
    const f = path.join(quartieriDir, `${q}.json`);
    if (!fs.existsSync(f)) fs.writeFileSync(f, '[]', 'utf8');
  });
}

// Legge il file JSON di un quartiere e ritorna un array di denunce
function readQuartiereFile(quartiere) {
  const file = path.join(quartieriDir, `${quartiere}.json`);
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    // Se il JSON è corrotto, ritorniamo array vuoto per non rompere il flusso
    return [];
  }
}

// Riscrive il file JSON di un quartiere con l'array fornito
function writeQuartiereFile(quartiere, arr) {
  const file = path.join(quartieriDir, `${quartiere}.json`);
  fs.writeFileSync(file, JSON.stringify(arr, null, 2), 'utf8');
}

// Legge tutti i file dei quartieri presenti nella cartella e ritorna un oggetto { quartiere: [denunce] }
function readAllQuartieri() {
  ensureDirs();
  const files = fs.readdirSync(quartieriDir).filter(f => f.endsWith('.json'));
  const result = {};
  files.forEach(f => {
    const q = path.basename(f, '.json');
    result[q] = readQuartiereFile(q);
  });
  return result;
}

// Legge il file di archivio (array di denunce archiviate)
function readArchive() {
  ensureDirs();
  const raw = fs.readFileSync(archiveFile, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Scrive l'array di denunce nell'archivio
function writeArchive(arr) {
  ensureDirs();
  fs.writeFileSync(archiveFile, JSON.stringify(arr, null, 2), 'utf8');
}

// Aggiunge una riga al file di log (usato per tracciare operazioni)
function appendLog(line) {
  ensureDirs();
  fs.appendFileSync(logFile, line + '\n', 'utf8');
}

module.exports = {
  ensureDirs,
  readQuartiereFile,
  writeQuartiereFile,
  readAllQuartieri,
  readArchive,
  writeArchive,
  appendLog,
  dataDir,
  quartieriDir,
  archiveFile,
  logFile
};
