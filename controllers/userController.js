const { User } = require('../models')

module.exports = class {
    static async getInfo(req, res, next) {
        try {
            const userInfo = await User.findByPk(req.user.id, {
                attributes: ['username', 'imageUrl']
            })
            res.status(200).json(userInfo)
        } catch (error) {
            next(error)
        }
    }
}