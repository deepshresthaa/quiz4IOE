const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/register", async (req, res) => {
  res.render("register");
});
router.get("/login", async (req, res) => {
  res.render("login");
});

module.exports = router;
