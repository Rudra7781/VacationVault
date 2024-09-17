// Import the validateToken function from the authentication service
const { validateToken } = require("../services/authentication");

/**
 * Middleware function to check for the presence of an authentication cookie.
 * @param {string} cookieName - The name of the cookie that stores the authentication token.
 * @returns {function} Middleware function that checks the cookie, validates the token, and sets the user information in the request object.
 */
function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    // Retrieve the value of the token from the specified cookie
    const tokenCookieValue = req.cookies[cookieName];

    // If the token is not present, proceed to the next middleware without modifying the request
    if (!tokenCookieValue) {
      return next();
    }

    try {
      // Validate the token and extract the user payload
      const userPayload = validateToken(tokenCookieValue);
      // Attach the user information to the request object for further use in the application
      req.user = userPayload;
    } catch (error) {
      // If token validation fails, silently proceed without setting req.user
    }

    // Continue to the next middleware or route handler
    return next();
  };
}

// Export the middleware function for use in other parts of the application
module.exports = {
  checkForAuthenticationCookie,
};
