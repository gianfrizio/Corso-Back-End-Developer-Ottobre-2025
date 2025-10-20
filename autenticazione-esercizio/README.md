# Autenticazione - Esercizio

Setup iniziale e test rapido per l'esercizio di autenticazione con Express.

Comandi:

1. Installare dipendenze

```
npm install
```

2. Avviare il server

```
npm start
```

3. Endpoint principali

- POST /auth/login { "username":"admin", "password":"1234" } -> ritorna token
- POST /auth/logout (Header: Authorization: Bearer <token>) -> aggiunge token a blacklist
- GET /studenti (Header: Authorization: Bearer <token>) -> lista studenti (protetto)
- GET /profilo (Header: Authorization: Bearer <token>) -> profilo utente (protetto)

Token statico usato nell'esercizio: abc12345token
