const { Post } = require('../models'); // Import the Post model
const { Op } = require('sequelize');

class LikesController {
  static async addLike(req, res, next) {
    try {
      const postId = req.params.id;
      const userName = req.user.username;

      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const currentLikes = post.likes || [];
      if (!post.likes) post.likes = []
      const newLike = {
        likedAt: new Date().toISOString(), 
        userName,
      };

      
      const alreadyLiked = currentLikes.some(
        (like) => like.userName === userName
      );

      if (alreadyLiked) {
        return res.status(400).json({ message: 'User already liked this post' });
      }

      // Update the post's likes with the new like
      const updatedLike = [...post.likes, newLike];

      // Save the updated post
      post.likes = updatedLike;
      await post.save();

      res.status(200).json({
        message: 'Post liked successfully',
        likesCount: currentLikes.length, // Return the updated number of likes
        likes: currentLikes, // Optionally, return the list of likes
      });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = LikesController;
