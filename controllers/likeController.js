const { Post } = require('../models'); // Import the Post model
const { Op } = require('sequelize');

class LikesController {
  static async addLike(req, res, next) {
    try {
      const postId = req.params.id;
      const { userName } = req.body;

      // Get the post by ID
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Get current likes and append the new like
      const currentLikes = post.likes || [];
      const newLike = {
        userName,
        likedAt: new Date().toISOString(), // Save the time of the like
      };

      // Check if the user already liked the post
      const alreadyLiked = currentLikes.some(
        (like) => like.userName === userName
      );

      if (alreadyLiked) {
        return res.status(400).json({ message: 'User already liked this post' });
      }

      // Update the post's likes with the new like
      currentLikes.push(newLike);

      // Save the updated post
      post.likes = currentLikes;
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

  static async getLikes(req, res, next) {
    try {
      const postId = req.params.id;

      // Get the post by ID
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const likesCount = post.likes.length;

      res.status(200).json({
        likesCount,
        likes: post.likes, // Optionally, return the list of likes
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LikesController;
