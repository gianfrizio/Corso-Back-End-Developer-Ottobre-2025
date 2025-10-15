const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Valida il nome inserito dall'utente
 * @param {string} nome - Nome da validare
 * @returns {Object} - { valid: boolean, error?: string, value?: string }
 */
function validateNome(nome) {
  const trimmedNome = nome.trim();

  if (trimmedNome.length === 0) {
    return { valid: false, error: "Il nome non può essere vuoto." };
  }

  if (trimmedNome.length < 2) {
    return { valid: false, error: "Il nome deve contenere almeno 2 caratteri." };
  }

  return { valid: true, value: trimmedNome };
}

/**
 * Valida l'età inserita dall'utente
 * @param {string} eta - Età da validare
 * @returns {Object} - { valid: boolean, error?: string, value?: number }
 */
function validateEta(eta) {
  const trimmedEta = eta.trim();

  // Verifica che sia un numero
  const etaNum = Number(trimmedEta);

  if (isNaN(etaNum)) {
    return { valid: false, error: "L'età deve essere un numero." };
  }

  // Verifica che sia un intero
  if (!Number.isInteger(etaNum)) {
    return { valid: false, error: "L'età deve essere un numero intero." };
  }

  // Verifica range
  if (etaNum < 0) {
    return { valid: false, error: "L'età non può essere negativa." };
  }

  if (etaNum > 150) {
    return { valid: false, error: "L'età deve essere inferiore a 150 anni." };
  }

  return { valid: true, value: etaNum };
}

/**
 * Chiede il nome all'utente con validazione
 */
function chiediNome() {
  rl.question("Come ti chiami? ", (nome) => {
    const validation = validateNome(nome);

    if (!validation.valid) {
      console.log(`Errore: ${validation.error} Riprova.`);
      chiediNome(); // Richiedi il nome
    } else {
      chiediEta(validation.value); // Passa il nome validato
    }
  });
}

/**
 * Chiede l'età all'utente con validazione
 * @param {string} nome - Nome già validato
 */
function chiediEta(nome) {
  rl.question("Quanti anni hai? ", (eta) => {
    const validation = validateEta(eta);

    if (!validation.valid) {
      console.log(`Errore: ${validation.error} Riprova.`);
      chiediEta(nome); // Richiedi l'età mantenendo il nome
    } else {
      console.log(`Ciao ${nome}, hai ${validation.value} anni!`);
      rl.close();
    }
  });
}

// Avvia il programma
chiediNome();
