const express = require("express");
const router = express.Router();
const blacklist = require("../data/blacklist");

// Finto utente
const USER = {
  username: "admin",
  password: "1234"
};

// Finto token statico
const TOKEN = "abc12345token";

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    return res.status(200).json({
      success: true,
      message: "Login riuscito!",
      token: TOKEN,
    });
  }

  res.status(401).json({
    success: false,
    message: "Credenziali non valide",
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (token && !blacklist.includes(token)) {
    blacklist.push(token);
  }

  res.status(200).json({
    success: true,
    message: "Logout eseguito, token aggiunto alla blacklist",
  });
});

module.exports = router;
