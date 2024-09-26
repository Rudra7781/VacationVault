const path = require("path"); // Import path module for handling file paths
const express = require("express"); // Import Express framework
 
const userRoute = require("./routes/user"); // Import user routes
const vaultRoute = require("./routes/vault"); // Import vault routes
 
const mongoose = require("mongoose"); // Import Mongoose for MongoDB interaction
const cookieParser = require("cookie-parser"); // Import cookie-parser for handling cookies
 
const Vault = require("./models/vault"); // Import Vault model for interacting with vault data
 
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication"); // Import custom middleware for authentication check
 
const app = express(); // Initialize Express application
const PORT = 8000; // Define port number
 
// Configure Mongoose to connect to MongoDB
mongoose.set("strictQuery", false); // Allow non-strict query behavior
mongoose
  .connect(
    "mongodb+srv://ajitmudgerikar4:sit726@vacationvaultcluster0.7zfz1.mongodb.net/?retryWrites=true&w=majority&appName=VacationVaultCluster0"
  )
  .then((e) => console.log("MongoDB Connected")); // Log success message on successful connection
 
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.resolve("./views")); // Set directory for view templates
 
// Middleware setup
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies (e.g., form submissions)
app.use(cookieParser()); // Parse cookies attached to the client request object
app.use(checkForAuthenticationCookie("token")); // Use custom middleware to check for authentication cookie
app.use(express.static(path.resolve("./public"))); // Serve static files from the 'public' directory
 
// Route for the landing page
app.get("/", (req, res) => {
  res.render("landing", {
    user: req.user, // Pass user information to the view
  });
});
 
// Route for the homepage with vaults
app.get("/home", async (req, res) => {
  const allVaults = await Vault.find({}).populate("createdBy", "fullName");
 
  res.render("home", {
    user: req.user, // Pass user information to the view
    vaults: allVaults, // Pass all vaults to the view
  });
});
 
// Routes for user and vault
app.use("/user", userRoute); // Handle user-related routes
app.use("/vault", vaultRoute); // Handle vault-related routes
 
// Start the server and listen for incoming requests
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`)); // Log a message when the server starts
 