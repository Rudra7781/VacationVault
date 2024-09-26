// Import the Schema and model functions from Mongoose to define and create a MongoDB model
const { Schema, model } = require("mongoose");
 
// Define the schema for the Vault model
const vaultSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    // Cover image for the vault
    coverImageURL: {
      type: String,
      required: false,
    },
    // Array of additional images with captions
    images: [
      {
        url: String,
        caption: String,
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);
 
const Vault = model("vault", vaultSchema);
module.exports = Vault;
 