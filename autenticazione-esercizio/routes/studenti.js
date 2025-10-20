const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "..", "db", "studenti.json"), "utf8");
  const studenti = JSON.parse(data);

  res.status(200).json({
    success: true,
    studenti
  });
});

module.exports = router;
