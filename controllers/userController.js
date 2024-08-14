const { User } = require('../models')
const { hashPassword } = require('../utils/bcrypt')
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { signToken, verifyToken } = require("../utils/jwt");

module.exports = class {
    static async getInfo(req, res, next) {
        try {
            const userInfo = await User.findByPk(req.user.id, {
                attributes: ['username', 'imageUrl', 'id']
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

   static async register (req, res, next) {
        try {
          let { email, username, password } = req.body;
          if (!email) {
            throw { name: "NoEmail" };
          }
          if (!password) {
            throw { name: "NoPassword" };
          }
      
          const user = await User.create({
            email,
            username,
            password: hashPassword(password),
          });
      
          res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
          });
        } catch (err) {
          next(err);
        }
      }

      static async login (req, res, next) {
        try {
          let { email, password } = req.body;
          if (!email) {
            throw { name: "NoEmail" };
          }
          if (!password) {
            throw { name: "NoPassword" };
          }
      
          const user = await User.findOne({ where: { email } });
          if (!user) {
            throw { name: "Invalid email/password" };
          }
      
          const checkPass = comparePassword(password, user.password);
          if (!checkPass) {
            throw { name: "Invalid email/password" };
          }
      
          const token = signToken({
            id: user.id,
          });
          res.status(200).json({
            access_token: token,
          });
        } catch (err) {
          next(err);
        }
      }
}