const { Schema, model } = require("mongoose"); // Mongoose functions for defining schema and creating models

const likesSchema = new Schema(
    {
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        vaultId: {
            type: Schema.Types.ObjectId,
            ref: "vault",
          },
    },
    {
        // Automatically add createdAt and updatedAt timestamps to the schema
        timestamps: true,
    }
)

const Likes = model("like", likesSchema);
module.exports = Likes;
