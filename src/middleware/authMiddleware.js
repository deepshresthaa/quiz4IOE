const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.redirect("/auth/login"); // Redirect to login page if token is not present
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.userId; // Attach user ID to the request object
    next();
  } catch (err) {
    console.error("Authorization error:", err.message);
    res.redirect("/auth/login"); // Redirect to login if token is invalid or expired
  }
};

module.exports = authMiddleware;
