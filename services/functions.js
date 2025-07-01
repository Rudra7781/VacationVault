const countLikesForVault = async (vaultId) => {
    try {
        const likeCount = await Like.countDocuments({ vaultId });
        return likeCount;
    } catch (err) {
        console.error(err);
        return 0; // If there's an error, return 0 likes.
    }
};

module.exports = countLikesForVault; // Export the router to be used in other parts of the application.
