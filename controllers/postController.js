const { Post, User } = require('../models')

module.exports = class {
    static async postPost(req, res, next) {
        const { imageUrl, description } = req.body
        try {
            await Post.create({
                userId: req.user.id,
                description,
                imageUrl
            })
            res.status(200).json({ message: 'posted' })
        } catch (error) {
            console.log(error)
            next(error)
        }
    }

    static async getPosts(req, res, next) {
        try {
            const posts = await Post.findAll({
                order: [['createdAt', 'DESC']],
                include: {
                    model: User,
                    attributes: ['username', 'imageUrl']
                }
            });
            res.status(200).json(posts)
        } catch (error) {
            next(error)
        }
    }
}