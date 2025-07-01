const { Router } = require("express"); // Import the Router module from the Express framework to define route handlers.
const User = require("../models/user"); // Import the User model to interact with the user collection in MongoDB.
const Vault = require("../models/vault"); // Import the Vault model to interact with the vault collection in MongoDB.
const Likes = require("../models/likes"); // Import the Vault model to interact with the vault collection in MongoDB.

const router = Router(); // Create a new Router instance to define the routes.

router.post("/add", async (req, res) => {
    const { userId, vaultId } = req.body; // Extract userId and vaultId from the request body.
    // If userId is missing, the user is not authenticated
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Authentication required. User ID is missing."
        });
    }

    // If vaultId is missing, there is an issue with the request
    if (!vaultId) {
        return res.status(400).json({
            success: false,
            message: "Vault ID is missing. There was an error in rendering the request."
        });
    }
    try {
        const existingRecord = await Likes.findOne({ likedBy: userId, vaultId });
        if (existingRecord) {
            const result = await Likes.deleteOne({ likedBy: userId, vaultId });
            return res.status(200).json({ message: "Like removed successfully." });
        }

        await Likes.create({
            // Create a new user in the database with the provided data.
            likedBy: userId,
            vaultId,
        });

        return res.status(201).json({
            success: true,
            message: "UserVault combination added successfully"
        });// Redirect to the sign in page

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while processing your request.",
        });
    }
});

module.exports = router; // Export the router to be used in other parts of the application.
