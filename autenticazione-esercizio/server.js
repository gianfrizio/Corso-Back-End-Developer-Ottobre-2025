const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const studentiRouter = require("./routes/studenti");
const profiloRouter = require("./routes/profilo");
const authMiddleware = require("./middleware/authMiddleware");

app.use(express.json());

// Rotte pubbliche
app.use("/auth", authRouter);

// Rotte protette
app.use("/studenti", authMiddleware, studentiRouter);
app.use("/profilo", authMiddleware, profiloRouter);

// Root di base per confermare che il server è attivo
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server autenticazione attivo. Usa /auth, /studenti, /profilo",
    note: "GET /studenti e GET /profilo richiedono Authorization: Bearer abc12345token"
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
