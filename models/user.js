// Import necessary modules
const { createHmac, randomBytes } = require("crypto"); // Built-in Node.js package for cryptography
const { Schema, model } = require("mongoose"); // Mongoose functions for defining schema and creating models
const { createTokenForUser } = require("../services/authentication"); // Function to generate a JWT for authenticated users
 
// Define the schema for the User model, outlining the structure and constraints of user documents
const userSchema = new Schema(
  {
    // The full name of the user, required and must be unique
    fullName: {
      type: String,
      required: true,
      unique: true,
    },
    // The email address of the user, required and must be unique
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // A string to store the salt used for hashing the password
    salt: {
      type: String,
    },
    // The hashed password of the user, required
    password: {
      type: String,
      required: true,
    },
    // The URL of the user's profile image, with a default image if not provided
    profileImageURL: {
      type: String,
      default: "/images/default_profile.png",
    },
    // The role of the user, either "USER" or "ADMIN", defaulting to "USER"
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps to the schema
    timestamps: true,
  }
);
 
// Middleware to hash the user's password before saving the user document to the database
userSchema.pre("save", function (next) {
  const user = this;
 
  // If the password has not been modified, skip the hashing process
  if (!user.isModified("password")) return;
 
  // Generate a random salt and hash the password using HMAC with the SHA-256 algorithm
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
 
  // Store the salt and hashed password in the user document
  this.salt = salt;
  this.password = hashedPassword;
 
  // Proceed to the next middleware or save the user document
  next();
});
 
// Static method to match a provided password with the stored password and generate a JWT if successful
userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    // Find the user by email
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");
 
    // Retrieve the stored salt and hashed password
    const salt = user.salt;
    const hashedPassword = user.password;
 
    // Hash the provided password with the stored salt
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
 
    // Compare the provided hash with the stored hash
    if (hashedPassword !== userProvidedHash)
      throw new Error("Incorrect Password");
    else {
      // If the password matches, generate a token for the user
      const token = createTokenForUser(user);
      return token;
    }
  }
);
 
// Create the User model using the defined schema
const User = model("user", userSchema);
 
// Export the User model for use in other parts of the application
module.exports = User;
 
 