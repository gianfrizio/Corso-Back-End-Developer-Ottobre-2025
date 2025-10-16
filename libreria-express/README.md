# Mini API Libreria + Studenti

Esercizio completo Express.js con CRUD in memoria.

## 📦 Setup

```bash
npm install
```

## 🚀 Avvio Server

### PARTE 1 - API Libreria (porta 3000)
```bash
node server.js
```

### PARTE 2 - API Studenti (porta 3001)
```bash
node studenti.js
```

---

## 📚 PARTE 1 - API LIBRERIA

**Base URL:** `http://localhost:3000`

### Endpoint Disponibili

| Metodo | Endpoint | Descrizione | Body |
|--------|----------|-------------|------|
| GET | `/` | Messaggio benvenuto | - |
| GET | `/libri` | Lista tutti i libri | - |
| GET | `/libri/:id` | Dettagli libro | - |
| POST | `/libri` | Aggiungi libro | `{titolo, autore}` |
| PUT | `/libri/:id` | Aggiorna libro | `{titolo?, autore?}` |
| DELETE | `/libri/:id` | Elimina libro | - |

### 🧪 Test con curl

```bash
# 1. Lista tutti i libri
curl http://localhost:3000/libri

# 2. Dettagli libro ID 1
curl http://localhost:3000/libri/1

# 3. Aggiungi nuovo libro
curl -X POST http://localhost:3000/libri \
  -H "Content-Type: application/json" \
  -d '{"titolo":"Il nome della rosa","autore":"Umberto Eco"}'

# 4. Aggiorna libro ID 1
curl -X PUT http://localhost:3000/libri/1 \
  -H "Content-Type: application/json" \
  -d '{"titolo":"1984 (Edizione Speciale)"}'

# 5. Elimina libro ID 2
curl -X DELETE http://localhost:3000/libri/2
```

---

## 🎓 PARTE 2 - API STUDENTI (Challenge)

**Base URL:** `http://localhost:3001`

### Endpoint Disponibili

| Metodo | Endpoint | Descrizione | Body |
|--------|----------|-------------|------|
| GET | `/` | Messaggio benvenuto | - |
| GET | `/studenti` | Lista tutti gli studenti | - |
| GET | `/studenti/:id` | Dettagli studente | - |
| POST | `/studenti` | Aggiungi studente | `{nome, corso}` |
| PUT | `/studenti/:id` | Aggiorna studente | `{nome?, corso?}` |
| DELETE | `/studenti/:id` | Elimina studente | - |
| GET | `/ricerca?corso=...` | Ricerca per corso (BONUS) | - |

### 🧪 Test con curl

```bash
# 1. Lista tutti gli studenti
curl http://localhost:3001/studenti

# 2. Dettagli studente ID 1
curl http://localhost:3001/studenti/1

# 3. Aggiungi nuovo studente
curl -X POST http://localhost:3001/studenti \
  -H "Content-Type: application/json" \
  -d '{"nome":"Anna Neri","corso":"Fisica"}'

# 4. Aggiorna studente ID 1
curl -X PUT http://localhost:3001/studenti/1 \
  -H "Content-Type: application/json" \
  -d '{"corso":"Ingegneria Informatica"}'

# 5. Elimina studente ID 2
curl -X DELETE http://localhost:3001/studenti/2

# 6. BONUS - Ricerca studenti per corso
curl "http://localhost:3001/ricerca?corso=Informatica"

# 7. Test errore 400 (parametro mancante)
curl http://localhost:3001/ricerca

# 8. Test errore 404 (nessun risultato)
curl "http://localhost:3001/ricerca?corso=Chimica"
```

---

## 📝 Note Tecniche

### Middleware
- `express.json()` - Parsing automatico body JSON

### Gestione Errori
- **400 Bad Request** - Input non valido o mancante
- **404 Not Found** - Risorsa non trovata
- **201 Created** - Risorsa creata con successo

### Validazione Input
Tutti gli endpoint POST/PUT validano i campi obbligatori.

### ID Generazione
Usa `Date.now()` per generare ID univoci (adatto per test, non per produzione).

---

## 🎯 Checklist Completamento

### PARTE 1 - Libreria
- ✅ GET `/libri` - Lista tutti
- ✅ GET `/libri/:id` - Dettagli
- ✅ POST `/libri` - Aggiungi
- ✅ PUT `/libri/:id` - Aggiorna
- ✅ DELETE `/libri/:id` - Elimina

### PARTE 2 - Studenti
- ✅ GET `/studenti` - Lista tutti
- ✅ GET `/studenti/:id` - Dettagli
- ✅ POST `/studenti` - Aggiungi
- ✅ PUT `/studenti/:id` - Aggiorna
- ✅ DELETE `/studenti/:id` - Elimina

### BONUS
- ✅ GET `/ricerca?corso=...` - Ricerca con query params
- ✅ Errore 400 se parametro mancante
- ✅ Errore 404 se nessun risultato

---

## 🛠️ Test con Thunder Client (VS Code)

### Setup Collection

1. Installa **Thunder Client** extension in VS Code
2. Crea una nuova Collection "Libreria API"
3. Aggiungi richieste per ogni endpoint

### Esempio Request POST
```
Method: POST
URL: http://localhost:3000/libri
Headers:
  Content-Type: application/json
Body (JSON):
{
  "titolo": "Il Piccolo Principe",
  "autore": "Antoine de Saint-Exupéry"
}
```

---

## 📚 Risorse

- [Express.js Docs](https://expressjs.com/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [REST API Best Practices](https://restfulapi.net/)
