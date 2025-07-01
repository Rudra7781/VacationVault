const { Router } = require("express"); // Import the Router module from the Express framework to define route handlers.
const Vault = require("../models/vault"); // Import the Vault model to interact with the vault collection in MongoDB.
const Like = require("../models/likes"); // Import the Vault model to interact with the vault collection in MongoDB.

const router = Router(); // Create a new Router instance to define the routes.


router.get("/", (req, res) => {
    res.render("landing", {
        user: req.user, // Pass user information to the view
    });
});

// Route for the homepage with vaults
router.get("/home", async (req, res) => {
    const allVaults = await Vault.find({}).populate("createdBy", "fullName");


    const vaultsWithLikes = await Promise.all(
        allVaults.map(async vault => {
            const likeCount = await Like.countDocuments({ vaultId: vault._id });
            let hasUserLiked = false;
            if (req.user) { // if user is present 
                hasUserLiked = await Like.exists({ vaultId: vault._id, likedBy: req.user._id });
                
            }
            return { ...vault._doc, likeCount, isLiked : !!hasUserLiked }; // Add likeCount to each vault object
        })
    );
    res.render("home", {
        user: req.user, // Pass user information to the view
        vaults: vaultsWithLikes, // Pass all vaults to the view
    });
});

module.exports = router; // Export the router to be used in other parts of the application.
