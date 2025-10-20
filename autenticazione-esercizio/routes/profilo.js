const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    utente: {
      username: "admin",
      ruolo: "docente",
      messaggio: "Accesso autorizzato al profilo"
    }
  });
});

module.exports = router;
