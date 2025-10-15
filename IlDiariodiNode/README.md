# Il Diario di Node

Esercizio guidato per imparare i moduli Node.js e la gestione dei file.

## Struttura del progetto

- `operazioni.js` - Modulo con le funzioni per gestire il diario
- `main.js` - File principale che usa le funzioni del modulo
- `diario.txt` - File dove vengono salvate le voci (creato automaticamente)

## Funzioni disponibili

### `aggiungiVoce(testo)`
Aggiunge una nuova voce al diario con data e ora automatiche.

### `leggiDiario()`
Mostra tutte le voci del diario.

### `contaVoci()`
Restituisce il numero di voci presenti nel diario.

### `cancellaDiario()`
Elimina tutte le voci del diario.

## Come eseguire

```bash
# Dalla cartella principale del corso
node IlDiariodiNode/main.js

# Oppure entra nella cartella e esegui
cd IlDiariodiNode
node main.js
```

## Cosa impari con questo esercizio

1. ✅ Come creare moduli personalizzati in Node.js
2. ✅ Come esportare e importare funzioni con `module.exports` e `require()`
3. ✅ Come usare il modulo `fs` per leggere e scrivere file
4. ✅ Come gestire errori con try-catch
5. ✅ Come formattare date in italiano
6. ✅ Come organizzare il codice in modo pulito e riutilizzabile

## Personalizzazione

Puoi modificare `main.js` per:
- Aggiungere le tue voci personali
- Sperimentare con le diverse funzioni
- Creare nuove funzioni in `operazioni.js`

Buon divertimento! 🚀
