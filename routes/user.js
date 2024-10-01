const { Router } = require("express"); // Import the Router module from the Express framework to define route handlers.
const User = require("../models/user"); // Import the User model to interact with the user collection in MongoDB.

const router = Router(); // Create a new Router instance to define the routes.

router.get("/signin", (req, res) => {
    // Define a route to render the sign-in page.
    return res.render("signin"); // Render the "signin" view when the /signin route is accessed.
});

router.get("/signup", (req, res) => {
    // Define a route to render the sign-up page.
    return res.render("signup"); // Render the "signup" view when the /signup route is accessed.
});

router.post("/signup", async (req, res) => {
    // Define a route to handle the sign-up form submission.
    const { fullName, email, password } = req.body; // Extract fullName, email, and password from the request body.
    try {
        await User.create({
            // Create a new user in the database with the provided data.
            fullName,
            email,
            password,
        });
        return res.redirect("/user/signin"); // Redirect to the sign in page
    } catch (error) {
        return res.render("signup", {
            // If there's an error, re-render the signup page with an error message.
            error: "Invalid or Duplicate Email or Password",
        });
    }
});

router.post("/signin", async (req, res) => {
    // Define a route to handle the sign-in form submission.
    const { email, password } = req.body; // Extract email and password from the request body.
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        // Match the provided password with the stored one and generate a token.

        console.log("token", token); // Log the token to the console (for debugging purposes).
        return res.cookie("token", token).redirect("/"); // Set a cookie with the generated token and redirect to the home page.
    } catch (error) {
        return res.render("signin", {
            // If there's an error, re-render the signin page with an error message.
            error: "Incorrect Email or Password",
        });
    }
});

router.get("/logout", (req, res) => {
    // Define a route to handle user logout.
    res.clearCookie("token").redirect("/"); // Clear the token cookie and redirect to the home page.
});

module.exports = router; // Export the router to be used in other parts of the application.
