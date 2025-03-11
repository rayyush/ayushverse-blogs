const JWT = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

// ✅ Debug: Check if the secret is actually loaded
if (!secret) {
  console.error("🚨 JWT_SECRET is undefined! Check your .env file.");
  process.exit(1); // Stop execution if the secret is missing
} else {
  console.log("✅ JWT_SECRET loaded successfully.");
}

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
    fullName: user.fullName,
  };

  // ✅ Debug: Check before signing
  console.log("🔍 Signing JWT with payload:", payload);

  return JWT.sign(payload, secret, { expiresIn: "1h" });
}

function validateToken(token) {
  try {
    console.log("🔍 Validating Token:", token);
    const decoded = JWT.verify(token, secret);
    console.log("✅ Decoded Token:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ JWT Validation Error:", error.message);
    return null;
  }
}

module.exports = { createTokenForUser, validateToken };
