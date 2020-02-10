const jwt = require("jsonwebtoken");

module.exports = function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error({ error: "Access denied" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new Error({ error: "Access denied" });
      } else {
        req.user = decoded.id;
        next();
      }
    });
  } catch {
    res.status(401).json({ error: "Access denied" });
  }
};
