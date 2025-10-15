// Modulo principale per la logica delle denunce
// - espone funzioni per aggiungere, cercare, aggiornare, cancellare, archiviare e generare report
const storage = require('./storage');
const { log, nowTimestamp } = require('./logger');

// Genera un id progressivo unico per il quartiere: cerca il massimo id esistente e aggiunge 1
function generateIdForQuartiere(quartiere) {
  const arr = storage.readQuartiereFile(quartiere);
  let max = 0;
  arr.forEach(d => { if (d.id > max) max = d.id; });
  return max + 1;
}

// Aggiunge una nuova denuncia in un quartiere
// - chiede i dati obbligatori e genera id/data/risolta automaticamente
// - impedisce duplicati (stesso cittadino + stesso tipo nello stesso quartiere)
function addDenuncia({ cittadino, tipo, descrizione, quartiere, priorita }) {
  const q = quartiere;
  const arr = storage.readQuartiereFile(q);
  // impedisce duplicati: stesso cittadino + stesso tipo
  const dup = arr.some(d => d.cittadino === cittadino && d.tipo === tipo);
  if (dup) return { success: false, message: 'Denuncia duplicata (stesso cittadino e tipo)' };
  const id = generateIdForQuartiere(q);
  const denuncia = {
    id,
    cittadino,
    tipo,
    descrizione,
    quartiere: q,
    risolta: false, // di default non risolta
    // usare solo la parte data (YYYY-MM-DD)
    data: new Date().toISOString().slice(0,10),
    priorita
  };
  arr.push(denuncia);
  storage.writeQuartiereFile(q, arr);
  log(`Aggiunta denuncia: ${cittadino} ${id} ${tipo} Quartiere ${q}`);
  return { success: true, denuncia };
}

// Restituisce tutte le denunce di tutti i quartieri come array piatto
function listAllDenunce() {
  const all = storage.readAllQuartieri();
  const merged = [];
  Object.values(all).forEach(arr => merged.push(...arr));
  return merged;
}

// Ricerca generica: cerca il termine in tutti i campi (case-insensitive)
function search(term) {
  const t = term.toLowerCase();
  const all = listAllDenunce();
  const res = all.filter(d => {
    return Object.values(d).some(v => String(v).toLowerCase().includes(t));
  });
  log(`Ricerca: "${term}" ${res.length} risultati trovati`);
  return res;
}

// Trova una denuncia in un quartiere per id e ritorna l'array del quartiere e l'elemento trovato
function findById(quartiere, id) {
  const arr = storage.readQuartiereFile(quartiere);
  const found = arr.find(d => d.id === id);
  return { arr, found };
}

// Segna una denuncia come risolta (imposta risolta=true e salva il file del quartiere)
function markResolved(quartiere, id) {
  const { arr, found } = findById(quartiere, id);
  if (!found) return { success: false, message: 'Non trovato' };
  if (found.risolta) return { success: false, message: 'Gia risolta' };
  found.risolta = true;
  storage.writeQuartiereFile(quartiere, arr);
  log(`Denuncia ID ${id} segnata come risolta (Quartiere ${quartiere})`);
  return { success: true, found };
}

// Rimuove una denuncia da un quartiere tramite filtro su id
function removeDenuncia(quartiere, id) {
  const arr = storage.readQuartiereFile(quartiere);
  const newArr = arr.filter(d => d.id !== id);
  if (newArr.length === arr.length) return { success: false, message: 'Non trovato' };
  storage.writeQuartiereFile(quartiere, newArr);
  log(`Eliminata denuncia: ID ${id} Quartiere ${quartiere}`);
  return { success: true };
}

// Archivia le denunce risolte da più di 30 giorni
// - legge tutti i quartieri, filtra le denunce risolte con data >30 giorni
// - le aggiunge a archive.json e le rimuove dai file di quartiere
// - ritorna il numero di denunce archiviate
function archiveOld() {
  const all = storage.readAllQuartieri();
  const archive = storage.readArchive();
  const now = new Date();
  const THIRTY = 1000 * 60 * 60 * 24 * 30;
  let count = 0;
  Object.keys(all).forEach(q => {
    const arr = all[q];
    const remaining = [];
    arr.forEach(d => {
      if (d.risolta) {
        // controlla se la data è più vecchia di 30 giorni
        const dDate = new Date(d.data);
        if (!isNaN(dDate.getTime()) && (now - dDate) > THIRTY) {
          // se la denuncia è risolta e vecchia di 30 giorni la archiviamo
          archive.push(d);
          count++;
        } else {
          // altrimenti la manteniamo nel quartiere
          remaining.push(d);
        }
      } else {
        // denunce non risolte rimangono
        remaining.push(d);
      }
    });
    // riscriviamo il file del quartiere con le denunce rimanenti
    storage.writeQuartiereFile(q, remaining);
  });
  if (count > 0) {
    storage.writeArchive(archive);
    log(`Archiviate ${count} denunce vecchie.`);
  }
  return count;
}
// Genera un report statistico e lo salva in data/report.json
// - totali, risolte, aperte, percentuale risolte
// - conteggi per quartiere, tipo, priorita
// - quartiere con più denunce, tipo più frequente
// Ritorna l'oggetto report
function generateReport() {
  const all = listAllDenunce();
  const archive = storage.readArchive();
  const combined = all.concat(archive);
  const totals = combined.length;
  const risolte = combined.filter(d => d.risolta).length;
  const aperte = totals - risolte;
  const percentRisolte = totals === 0 ? 0 : (risolte / totals) * 100;
  const quartieri = {};
  const tipi = {};
  const priorita = {};
  combined.forEach(d => {
    quartieri[d.quartiere] = (quartieri[d.quartiere] || 0) + 1;
    tipi[d.tipo] = (tipi[d.tipo] || 0) + 1;
    priorita[d.priorita] = (priorita[d.priorita] || 0) + 1;
  });
  const sortedTipi = Object.keys(tipi).sort((a,b)=>tipi[b]-tipi[a]);
  const tipoPiuFrequente = sortedTipi[0] || null;
  const sortedQuartieri = Object.keys(quartieri).sort((a,b)=>quartieri[b]-quartieri[a]);
  const quartiereTop = sortedQuartieri[0] || null;
  // Calcola percentuali per quartiere
  const quartieriPercent = {};
  sortedQuartieri.forEach(k => {
    quartieriPercent[k] = {
      count: quartieri[k],
      percent: Math.round((quartieri[k] / (totals || 1)) * 10000) / 100 // two decimals
    };
  });
  // Top 3 quartieri attivi
  const topQuartieri = sortedQuartieri.slice(0,3).map(k => ({ quartiere: k, count: quartieri[k], percent: quartieriPercent[k].percent }));
  const report = {
    generatedAt: new Date().toISOString(),
    totali: totals,
    risolte,
    aperte,
    percentualeRisolte: Math.round(percentRisolte*100)/100 + '%',
    quartieri: quartieri,
    quartieriPercent: quartieriPercent,
    topQuartieri: topQuartieri,
    tipi,
    priorita,
    quartiereTop,
    tipoPiuFrequente
  };
  const fs = require('fs');
  const path = require('path');
  const file = path.join(storage.dataDir, 'report.json');
  fs.writeFileSync(file, JSON.stringify(report, null, 2), 'utf8');
  log(`Report generato: ${totals} denunce totali (${report.percentualeRisolte} risolte)`);
  return report;
}

module.exports = {
  addDenuncia,
  listAllDenunce,
  search,
  findById,
  markResolved,
  removeDenuncia,
  archiveOld,
  generateReport
};
