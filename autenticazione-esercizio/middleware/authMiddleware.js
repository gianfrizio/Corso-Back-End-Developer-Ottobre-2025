const blacklist = require("../data/blacklist");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Token mancante. Accesso negato.",
    });
  }

  const token = authHeader.split(" ")[1];

  // Se il token è stato revocato
  if (blacklist.includes(token)) {
    return res.status(403).json({
      success: false,
      message: "Token revocato. Fai di nuovo login.",
    });
  }

  // Se il token è sbagliato
  if (token !== "abc12345token") {
    return res.status(403).json({
      success: false,
      message: "Token non valido. Accesso negato.",
    });
  }

  // Tutto ok
  next();
}

module.exports = authMiddleware;
