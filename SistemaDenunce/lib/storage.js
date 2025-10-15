const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Percorsi principali dei dati
const dataDir = path.join(__dirname, '..', 'data');
const quartieriDir = path.join(dataDir, 'quartieri');
const archiveFile = path.join(dataDir, 'archive.json');
const logFile = path.join(dataDir, 'log.txt');

// ============================================================
// UTILITY PER ERROR HANDLING E LOGGING
// ============================================================

/**
 * Logga errori critici su console.error
 * In futuro può essere esteso per usare un logger strutturato
 */
function logError(context, error) {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR ${timestamp}] ${context}:`, {
    message: error.message,
    code: error.code,
    path: error.path,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
}

/**
 * Determina se un errore è recuperabile o meno
 */
function isRecoverableError(error) {
  // ENOENT (file non esiste) è recuperabile → ritorna valore di default
  // EACCES (permessi negati) NON è recuperabile → deve propagare
  return error.code === 'ENOENT';
}

// ============================================================
// VERSIONI ASINCRONE (NUOVE - BEST PRACTICE)
// ============================================================

/**
 * Helper: crea un file solo se non esiste
 */
async function initFileIfNotExists(filePath, defaultContent) {
  try {
    await fsPromises.access(filePath);
    // File esiste, non fare nulla
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File non esiste, crealo
      await fsPromises.writeFile(filePath, defaultContent, 'utf8');
    } else {
      // Altro errore (es. permessi), propaga
      throw error;
    }
  }
}

/**
 * Assicura che le cartelle e i file necessari esistano (ASYNC)
 * Usa { recursive: true } per evitare race conditions
 */
async function ensureDirsAsync() {
  try {
    // mkdir con recursive:true non fallisce se la directory esiste già
    await fsPromises.mkdir(dataDir, { recursive: true });
    await fsPromises.mkdir(quartieriDir, { recursive: true });

    // Inizializza i file solo se non esistono
    await initFileIfNotExists(archiveFile, '[]');
    await initFileIfNotExists(logFile, '');
    await initFileIfNotExists(path.join(dataDir, 'report.json'),
      JSON.stringify({ generatedAt: null, summary: {} }, null, 2));

    // Crea file quartieri di default
    const defaultQuartieri = ['Centro', 'Nord', 'Sud', 'Est', 'Ovest'];
    await Promise.all(
      defaultQuartieri.map(q =>
        initFileIfNotExists(path.join(quartieriDir, `${q}.json`), '[]')
      )
    );
  } catch (error) {
    logError('ensureDirsAsync', error);
    throw new Error(`Impossibile inizializzare le directory: ${error.message}`);
  }
}

/**
 * Legge il file JSON di un quartiere (ASYNC)
 * Gestisce gracefully: file mancante, JSON corrotto, errori permessi
 */
async function readQuartiereFileAsync(quartiere) {
  const file = path.join(quartieriDir, `${quartiere}.json`);

  try {
    const raw = await fsPromises.readFile(file, 'utf8');

    try {
      const parsed = JSON.parse(raw);

      // Validazione: deve essere un array
      if (!Array.isArray(parsed)) {
        logError(`readQuartiereFileAsync(${quartiere})`,
          new Error('File JSON non contiene un array, ritorno array vuoto'));
        return [];
      }

      return parsed;
    } catch (parseError) {
      // JSON corrotto - questo è un problema serio
      logError(`readQuartiereFileAsync(${quartiere}) - JSON corrotto`, parseError);
      // Ritorna array vuoto ma logga l'errore critico
      return [];
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File non esiste - scenario normale, ritorna array vuoto
      return [];
    } else {
      // Errore grave (EACCES, etc.) - logga e propaga
      logError(`readQuartiereFileAsync(${quartiere})`, error);
      throw new Error(`Impossibile leggere file quartiere ${quartiere}: ${error.message}`);
    }
  }
}

/**
 * Scrive il file JSON di un quartiere (ASYNC)
 * Gestisce errori di scrittura e serializzazione JSON
 */
async function writeQuartiereFileAsync(quartiere, arr) {
  const file = path.join(quartieriDir, `${quartiere}.json`);

  try {
    // Validazione input
    if (!Array.isArray(arr)) {
      throw new Error('Il parametro arr deve essere un array');
    }

    const jsonString = JSON.stringify(arr, null, 2);
    await fsPromises.writeFile(file, jsonString, 'utf8');
  } catch (error) {
    logError(`writeQuartiereFileAsync(${quartiere})`, error);

    // Distingui tra errori di serializzazione e errori I/O
    if (error instanceof TypeError || error.message.includes('circular')) {
      throw new Error(`Impossibile serializzare dati per quartiere ${quartiere}: ${error.message}`);
    } else {
      throw new Error(`Impossibile scrivere file quartiere ${quartiere}: ${error.message}`);
    }
  }
}

/**
 * Legge tutti i quartieri (ASYNC)
 * Ritorna oggetto { quartiere: [denunce] }
 */
async function readAllQuartieriAsync() {
  await ensureDirsAsync();

  try {
    const files = await fsPromises.readdir(quartieriDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const result = {};

    // Legge tutti i file in parallelo per performance
    await Promise.all(
      jsonFiles.map(async (f) => {
        const q = path.basename(f, '.json');
        result[q] = await readQuartiereFileAsync(q);
      })
    );

    return result;
  } catch (error) {
    logError('readAllQuartieriAsync', error);
    throw new Error(`Impossibile leggere i quartieri: ${error.message}`);
  }
}

/**
 * Legge il file archivio (ASYNC)
 */
async function readArchiveAsync() {
  await ensureDirsAsync();

  try {
    const raw = await fsPromises.readFile(archiveFile, 'utf8');

    try {
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        logError('readArchiveAsync', new Error('Archive non è un array'));
        return [];
      }

      return parsed;
    } catch (parseError) {
      logError('readArchiveAsync - JSON corrotto', parseError);
      return [];
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    } else {
      logError('readArchiveAsync', error);
      throw new Error(`Impossibile leggere archivio: ${error.message}`);
    }
  }
}

/**
 * Scrive l'archivio (ASYNC)
 */
async function writeArchiveAsync(arr) {
  await ensureDirsAsync();

  try {
    if (!Array.isArray(arr)) {
      throw new Error('Il parametro arr deve essere un array');
    }

    const jsonString = JSON.stringify(arr, null, 2);
    await fsPromises.writeFile(archiveFile, jsonString, 'utf8');
  } catch (error) {
    logError('writeArchiveAsync', error);
    throw new Error(`Impossibile scrivere archivio: ${error.message}`);
  }
}

/**
 * Aggiunge una riga al log (ASYNC)
 */
async function appendLogAsync(line) {
  await ensureDirsAsync();

  try {
    await fsPromises.appendFile(logFile, line + '\n', 'utf8');
  } catch (error) {
    // Log fallito - non bloccare l'applicazione, ma segnala su console
    console.error(`[WARN] appendLogAsync failed: ${error.message}`);
  }
}

// ============================================================
// VERSIONI SINCRONE (LEGACY - PER COMPATIBILITÀ)
// Migliorate con error handling ma mantenute sync
// ============================================================

/**
 * Assicura che le cartelle e i file necessari esistano
 * @deprecated Usa ensureDirsAsync() per nuove implementazioni
 */
function ensureDirs() {
  try {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(quartieriDir)) fs.mkdirSync(quartieriDir, { recursive: true });
    if (!fs.existsSync(archiveFile)) fs.writeFileSync(archiveFile, '[]', 'utf8');
    if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, '', 'utf8');

    const reportFile = path.join(dataDir, 'report.json');
    if (!fs.existsSync(reportFile)) {
      fs.writeFileSync(reportFile, JSON.stringify({ generatedAt: null, summary: {} }, null, 2), 'utf8');
    }

    const defaultQuartieri = ['Centro', 'Nord', 'Sud', 'Est', 'Ovest'];
    defaultQuartieri.forEach(q => {
      const f = path.join(quartieriDir, `${q}.json`);
      if (!fs.existsSync(f)) fs.writeFileSync(f, '[]', 'utf8');
    });
  } catch (error) {
    logError('ensureDirs (sync)', error);
    throw new Error(`Impossibile inizializzare le directory: ${error.message}`);
  }
}

/**
 * Legge il file JSON di un quartiere e ritorna un array di denunce
 * @deprecated Usa readQuartiereFileAsync() per nuove implementazioni
 */
function readQuartiereFile(quartiere) {
  const file = path.join(quartieriDir, `${quartiere}.json`);

  try {
    if (!fs.existsSync(file)) return [];

    const raw = fs.readFileSync(file, 'utf8');

    try {
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        logError(`readQuartiereFile(${quartiere})`,
          new Error('File JSON non contiene un array'));
        return [];
      }

      return parsed;
    } catch (parseError) {
      logError(`readQuartiereFile(${quartiere}) - JSON corrotto`, parseError);
      return [];
    }
  } catch (error) {
    logError(`readQuartiereFile(${quartiere})`, error);

    if (isRecoverableError(error)) {
      return [];
    } else {
      throw new Error(`Impossibile leggere file quartiere ${quartiere}: ${error.message}`);
    }
  }
}

/**
 * Riscrive il file JSON di un quartiere con l'array fornito
 * @deprecated Usa writeQuartiereFileAsync() per nuove implementazioni
 */
function writeQuartiereFile(quartiere, arr) {
  const file = path.join(quartieriDir, `${quartiere}.json`);

  try {
    if (!Array.isArray(arr)) {
      throw new Error('Il parametro arr deve essere un array');
    }

    fs.writeFileSync(file, JSON.stringify(arr, null, 2), 'utf8');
  } catch (error) {
    logError(`writeQuartiereFile(${quartiere})`, error);
    throw new Error(`Impossibile scrivere file quartiere ${quartiere}: ${error.message}`);
  }
}

/**
 * Legge tutti i file dei quartieri presenti nella cartella
 * @deprecated Usa readAllQuartieriAsync() per nuove implementazioni
 */
function readAllQuartieri() {
  ensureDirs();

  try {
    const files = fs.readdirSync(quartieriDir).filter(f => f.endsWith('.json'));
    const result = {};

    files.forEach(f => {
      const q = path.basename(f, '.json');
      result[q] = readQuartiereFile(q);
    });

    return result;
  } catch (error) {
    logError('readAllQuartieri', error);
    throw new Error(`Impossibile leggere i quartieri: ${error.message}`);
  }
}

/**
 * Legge il file di archivio (array di denunce archiviate)
 * @deprecated Usa readArchiveAsync() per nuove implementazioni
 */
function readArchive() {
  ensureDirs();

  try {
    const raw = fs.readFileSync(archiveFile, 'utf8');

    try {
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        logError('readArchive', new Error('Archive non è un array'));
        return [];
      }

      return parsed;
    } catch (parseError) {
      logError('readArchive - JSON corrotto', parseError);
      return [];
    }
  } catch (error) {
    logError('readArchive', error);

    if (isRecoverableError(error)) {
      return [];
    } else {
      throw new Error(`Impossibile leggere archivio: ${error.message}`);
    }
  }
}

/**
 * Scrive l'array di denunce nell'archivio
 * @deprecated Usa writeArchiveAsync() per nuove implementazioni
 */
function writeArchive(arr) {
  ensureDirs();

  try {
    if (!Array.isArray(arr)) {
      throw new Error('Il parametro arr deve essere un array');
    }

    fs.writeFileSync(archiveFile, JSON.stringify(arr, null, 2), 'utf8');
  } catch (error) {
    logError('writeArchive', error);
    throw new Error(`Impossibile scrivere archivio: ${error.message}`);
  }
}

/**
 * Aggiunge una riga al file di log (usato per tracciare operazioni)
 * @deprecated Usa appendLogAsync() per nuove implementazioni
 */
function appendLog(line) {
  ensureDirs();

  try {
    fs.appendFileSync(logFile, line + '\n', 'utf8');
  } catch (error) {
    // Log fallito - non bloccare l'applicazione
    console.error(`[WARN] appendLog failed: ${error.message}`);
  }
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  // Versioni sincrone (legacy - mantenute per compatibilità)
  ensureDirs,
  readQuartiereFile,
  writeQuartiereFile,
  readAllQuartieri,
  readArchive,
  writeArchive,
  appendLog,

  // Versioni asincrone (nuove - best practice)
  ensureDirsAsync,
  readQuartiereFileAsync,
  writeQuartiereFileAsync,
  readAllQuartieriAsync,
  readArchiveAsync,
  writeArchiveAsync,
  appendLogAsync,

  // Percorsi (per retrocompatibilità)
  dataDir,
  quartieriDir,
  archiveFile,
  logFile
};
