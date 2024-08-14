const { Post } = require('../models');

class CommentsController {
 
  static async addComment(req, res, next) {
    try {
      const { postId } = req.params;
      const { username, comment } = req.body;

      if (!username || !comment) {
        return res.status(400).json({ message: 'Username dan komentar wajib diisi' });
      }

      const post = await Post.findByPk(postId);

      if (!post) {
        return res.status(404).json({ message: 'Postingan tidak ditemukan' });
      }

      
      const newComment = {
        username,
        comment,
        date: new Date().toISOString(),
      };

    
      const updatedComments = [...post.comments, newComment];

    
      post.comments = updatedComments;
      await post.save();

      return res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

}

module.exports = CommentsController;
