const User = require("../models/User");

const jwt = require("jsonwebtoken");
let loggedUser;
// User Registration
exports.registerUser = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  console.log("inside registerUser ");
  try {
    console.log("inside try block:");
    console.log(username, email, password);
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .render("register", { msg: "User already exists!" });

    user = new User({ username, email, password });

    // Hash password

    await user.save();

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    }); // 1 month
    return res.render("index", {
      title: "Home",
      name: user.username,
      isAuthenticated: true,
    });
    // res.json({ msg: 'Login successful', token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.loginUser = async (req, res) => {
  console.log("req:: ", req.body);
  const { email, password } = req.body;
  loggedUser=email;

  try {
    // Find user and explicitly select password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).render("login", { msg: "Invalid credentials!" });
    }

    console.log("db:", user);

    // Compare passwords using the instance method
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).render("login", { msg: "Incorrect password!" });
    }

    // Generate JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Set the cookie with the token
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
    });

    return res.render("index", {
      title: "Home",
      name: user.username,
      isAuthenticated: true,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.logoutUser = async (req, res) => {
  try {
    console.log("Logout function called");
    console.log("Cookies before clearing:", req.cookies);

    // Clear the token cookie
    res.clearCookie("token", { path: "/" });
    console.log("Cookies cleared");

    res.redirect("/auth/login");
  } catch (err) {
    console.error("Error during logout:", err.message);
    res.status(500).send("Server Error");
  }
};
// exports.modules=loggedUser;
// module.exports=loggedUser;