const { User } = require('../models')
const { verifyToken } = require("../utils/jwt");

module.exports = async function auth(req, res, next) {
    try {
        const access_token = req.headers.authorization
        if (!access_token) throw { name: "InvalidToken" };

        const [type, token] = access_token.split(' ');
        if (type !== `Bearer`) throw { name: `InvalidToken` }

        const payload = verifyToken(token)
        
        const user = await User.findByPk(payload.id)
        if (!user) throw { name: `InvalidToken` }

        req.user = {
            id: user.id
        }

        next()
    } catch (error) {
        next(error)
    }
}