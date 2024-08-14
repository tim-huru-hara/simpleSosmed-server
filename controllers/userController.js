const { User } = require('../models')
const { hashPassword } = require('../utils/bcrypt')

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

    static async EditProfile (req, res, next) {
        try {
            const { id } = req.user;
    
            const { username, password, bio, imageUrl } = req.body;
            if (!username) throw { name: "EmptyUsername" }
            if (!password) throw { name: "EmptyPassword" }
            if (!bio) throw { name: "EmptyBio" }
            if (!imageUrl) throw { name: "EmptyImageUrl" }
    
            const user = await User.findByPk(id)
            if (!user) throw { name: "UserNotFound" }
    
            const editUser = await user.update({ username, password: hashPassword(password), bio, imageUrl })
    
            res.status(201).json({ message: "User update success" })
        } catch (error) {
            next(error)
        }
    }
}