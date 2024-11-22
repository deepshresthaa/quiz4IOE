const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");

// Middleware to parse POST form data
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
// const errorHandler = require('./middleware/errorHandler');

dotenv.config();

//connecting to the mongodb database

connectDB();

//middle wares

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extend: false }));

app.use(express.static(path.join(__dirname, "../public")));

app.set("view engine", "hbs");

app.set("views", path.join(__dirname, "./views"));
hbs.registerPartials(path.join(__dirname, "views/partials"));

// routes

app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);

// app.use(errorHandler);

// module.exports = app;

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
