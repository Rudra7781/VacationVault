const JWT = require("jsonwebtoken"); // Import the jsonwebtoken library for creating and verifying JSON Web Tokens.

const secret = "abc@123"; // Define a secret key used for signing and verifying tokens. In a real application, this should be stored securely.

function createTokenForUser(user) {
  // Function to create a JWT for a given user.
  const payload = {
    _id: user._id, // User's unique identifier.
    name: user.fullName, // User's full name.
    email: user.email, // User's email address.
    profileImageURL: user.profileImageURL, // URL to the user's profile image.
    role: user.role, // User's role (e.g., USER or ADMIN).
  };
  const token = JWT.sign(payload, secret); // Sign the payload with the secret key to create a token.
  return token; // Return the generated token.
}

function validateToken(token) {
  // Function to validate a given JWT and return its payload.
  const payload = JWT.verify(token, secret); // Verify the token using the secret key and return the decoded payload.
  return payload; // Return the decoded payload.
}

module.exports = {
  createTokenForUser, // Export the function to create a JWT for a user.
  validateToken, // Export the function to validate a JWT.
};
