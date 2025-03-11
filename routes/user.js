const { Router } = require("express");
const router = Router();
const User = require("../models/user");

router.get("/signin", (req, res) => {
  return res.render("signin", { currentUrl: req.originalUrl });
});

router.get("/signup", (req, res) => {
  return res.render("signup", { currentUrl: req.originalUrl });
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render("signup", {
        error: "Email already exists. Please use a different email.",
      });
    }

    // Create the user if email doesn't exist
    await User.create({
      fullName,
      email,
      password,
    });

    return res.redirect("/"); // Redirect to home page on successful signup
  } catch (error) {
    console.error("Signup error:", error);
    return res.render("signup", {
      error: "Something went wrong. Please try again.",
    });
  }
});

router.post("/signin", async (req, res) => {
  console.log("🛠 Signin Request Received:", req.body); // ✅ Debug log
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log("🔹 Generated Token:", token);

    // ✅ Set cookie correctly
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    console.log("✅ Cookie Set Successfully");

    return res.redirect("/");
  } catch (error) {
    console.error("❌ Signin Error:", error.message);
    return res.render("signin", { error: "Incorrect Email or Password" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
