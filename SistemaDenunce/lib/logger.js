// Logger semplice che scrive voci in `data/log.txt`
const { appendLog } = require('./storage');

// Restituisce timestamp leggibile: [DD/MM/YYYY hh:mm:ss]
function nowTimestamp() {
  const d = new Date();
  const date = d.toLocaleDateString();
  const time = d.toTimeString().split(' ')[0];
  return `[${date} ${time}]`;
}

// Scrive la linea di log con prefisso timestamp
function log(line) {
  appendLog(`${nowTimestamp()} ${line}`);
}

module.exports = { log, nowTimestamp };
