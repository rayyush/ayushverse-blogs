const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    password: { type: String, required: true },
    profileImageUrl: {
      type: String,
      default: "/images/profile-image.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// 🔹 Hash password before saving
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next(); // ✅ Skip if password unchanged

  const salt = randomBytes(16).toString("hex"); // ✅ Correctly generate salt
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;
  next();
});

// 🔹 Authenticate user & generate token
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User not found");

    console.log("🛠 Checking User Role Before Token Creation:", user.role); // ✅ Debugging Log

    const token = createTokenForUser(user);
    console.log("🔹 Generated Token for:", user.role); // ✅ Debugging Log

    return token;
  }
);

const User = model("User", userSchema);
module.exports = User;
