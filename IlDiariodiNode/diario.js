// operazioni.js - Funzioni asincrone per gestire il diario usando fs.promises

const fs = require('fs').promises;
const path = require('path');

// Nome del file del diario
const DIARIO_FILE = path.join(__dirname, 'diario.txt');

function formattaData(data = new Date()) {
    return data.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function handleFsError(err, actionDescription = '') {
    // Gestione comune degli errori fs
    if (!err || !err.code) {
        console.error(`❌ Errore sconosciuto ${actionDescription}:`, err && err.message ? err.message : err);
        return;
    }

    switch (err.code) {
        case 'ENOENT':
            console.error(`❌ ERRORE ENOENT: file non trovato durante: ${actionDescription}`);
            break;
        case 'EACCES':
        case 'EPERM':
            console.error(`❌ ERRORE PERMESSI (${err.code}) durante: ${actionDescription} — verifica i permessi.`);
            break;
        default:
            console.error(`❌ Errore (${err.code}) durante: ${actionDescription} —`, err.message);
    }
}

/**
 * Aggiunge una nuova voce al diario (append)
 * @param {string} testo
 */
async function aggiungiVoce(testo) {
    const dataFormatted = formattaData();
    const voce = `[${dataFormatted}]\n${testo}\n${'='.repeat(50)}\n\n`;

    try {
        await fs.appendFile(DIARIO_FILE, voce, 'utf8');
        console.log('✅ Voce aggiunta con successo al diario!');
    } catch (err) {
        handleFsError(err, 'aggiunta voce');
    }
}

/**
 * Sovrascrive il diario con un contenuto (writeFile)
 * @param {string} contenuto
 */
async function scriviDiario(contenuto) {
    try {
        await fs.writeFile(DIARIO_FILE, contenuto, 'utf8');
        console.log('✅ Diario sovrascritto con successo');
    } catch (err) {
        handleFsError(err, 'scrittura diario');
    }
}

/**
 * Legge e restituisce il contenuto del diario (readFile)
 * @returns {string|null}
 */
async function leggiDiario() {
    try {
        const contenuto = await fs.readFile(DIARIO_FILE, 'utf8');
        if (contenuto.trim() === '') {
            console.log('📖 Il diario è vuoto.');
            return '';
        }
        console.log('\n📖 ===== IL MIO DIARIO =====\n');
        console.log(contenuto);
        console.log('===== FINE DIARIO =====\n');
        return contenuto;
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('📖 Il diario non esiste ancora. Aggiungi la tua prima voce!');
            return null;
        }
        handleFsError(err, 'lettura diario');
        return null;
    }
}

/**
 * Rinomina il file del diario
 * @param {string} nuovoNome
 */
async function rinominaDiario(nuovoNome) {
    const nuovoPercorso = path.join(__dirname, nuovoNome);
    try {
        await fs.rename(DIARIO_FILE, nuovoPercorso);
        console.log(`✅ Diario rinominato in ${nuovoNome}`);
    } catch (err) {
        handleFsError(err, 'rinomina diario');
    }
}

/**
 * Cancella il diario (unlink)
 */
async function cancellaDiario() {
    try {
        await fs.unlink(DIARIO_FILE);
        console.log('🗑️  Diario cancellato con successo!');
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('ℹ️  Non c\'è nessun diario da cancellare.');
            return;
        }
        handleFsError(err, 'cancellazione diario');
    }
}

/**
 * Conta il numero di voci nel diario
 * @returns {number}
 */
async function contaVoci() {
    try {
        const contenuto = await fs.readFile(DIARIO_FILE, 'utf8');
        const numeroVoci = (contenuto.match(/={50}/g) || []).length;
        return numeroVoci;
    } catch (err) {
        if (err.code === 'ENOENT') return 0;
        handleFsError(err, 'conteggio voci');
        return 0;
    }
}

module.exports = {
    aggiungiVoce,
    scriviDiario,
    leggiDiario,
    rinominaDiario,
    cancellaDiario,
    contaVoci
};
