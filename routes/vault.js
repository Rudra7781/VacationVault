const { Router } = require("express"); // Import the Router module from the Express framework to define route handlers.
const multer = require("multer"); // Import Multer, a middleware for handling multipart/form-data, primarily for file uploads.
const path = require("path"); // Import the path module to work with file and directory paths.

const Vault = require("../models/vault"); // Import the Vault model to interact with the vault collection in MongoDB.

const router = Router(); // Create a new Router instance to define the routes.

const storage = multer.diskStorage({
    // Define storage options for Multer to specify where and how to save uploaded files.
    destination: function (req, file, cb) {
        // Set the destination directory for the uploaded files.
        cb(null, path.resolve(`./public/uploads/`)); // Save files in the `public/uploads` directory.
    },
    filename: function (req, file, cb) {
        // Set the filename for the uploaded files.
        const fileName = `${Date.now()}-${file.originalname}`; // Use the current timestamp and the original filename to create a unique file name.
        cb(null, fileName); // Pass the file name to the callback function.
    },
});

const upload = multer({ storage: storage }); // Create a Multer instance with the defined storage options for handling file uploads.

router.get("/add-new", (req, res) => {
    // Define a route for the "Add New Vault" page.
    if (!req.user) { // if user is not present redirect to sign
        return res.redirect("/user/signin")
    }
    return res.render("addVault", {
        // Render the "addVault" view with the user data from the request.
        user: req.user,
    });
});

router.get("/:id", async (req, res) => {
    // Define a route to fetch and display a specific vault by its ID.
    const vault = await Vault.findById(req.params.id).populate("createdBy"); // Find the vault by ID and populate the "createdBy" field with user details.

    return res.render("vault", {
        // Render the "vault" view with the vault data and user data from the request.
        user: req.user,
        vault,
    });
});
// Modify the route to handle multiple images upload
router.post(
    "/",
    upload.fields([{ name: "coverImage" }, { name: "additionalImages" }]),
    async (req, res) => {
        const { title, body } = req.body;

        // Split the captions string into an array of captions
        let captions = req.body.captions ? req.body.captions.split(",") : [];

        const images = [];
        if (req.files.additionalImages) {
            req.files.additionalImages.forEach((file, index) => {
                images.push({
                    url: `/uploads/${file.filename}`,
                    caption: captions[index] ? captions[index].trim() : "", // Match the caption or leave blank if missing
                });
            });
        }

        const vault = await Vault.create({
            title,
            body,
            createdBy: req.user._id,
            coverImageURL: `/uploads/${req.files.coverImage[0].filename}`,
            images,
        });

        return res.redirect(`/vault/${vault._id}`);
    }
);

module.exports = router; // Export the router to be used in other parts of the application.
