const {
  createTokenForUser,
  validateToken,
} = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    console.log("🍪 Cookie Value:", tokenCookieValue);

    if (!tokenCookieValue) {
      console.log("❌ No Token Found in Cookies");
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);

      if (!userPayload) {
        console.log("❌ Invalid or Expired Token");
        return next();
      }

      console.log("✅ User Authenticated:", userPayload);
      req.user = userPayload;
    } catch (error) {
      console.error("❌ Error Validating Token:", error.message);
    }

    return next();
  };
}

module.exports = { checkForAuthenticationCookie };
