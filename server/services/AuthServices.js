import jwt from 'jsonwebtoken'
import dayjs from 'dayjs'
import User from '../models/UserModel.js'
import Auth from '../models/AuthModel.js'

class AuthServices {
  /**
   * This Service extract the user from cookie, and save the user on the request object
   * @param Object req - express request object
   */
  static async getUserFromCookie(req) {
    try {
      let user
      const cookie = req.user ? req.user : req.cookies.user
      if (cookie) {
        console.log('regular user (not from google)')
        const decoded = jwt.verify(cookie, process.env.COOKIES_AUTH)
        const auth = await Auth.findById(decoded.token)
        if (!auth || dayjs(auth.expiresAt).isBefore(dayjs())) throw 401
        user = await User.findOne({ _id: auth.user })
      }
      if (!user) {
        throw new Error('Not verified')
      } else {
        req.user = user
        return user
      }
    } catch (e) {
      throw new Error('Not verified')
    }
  }

  /**
   * Find authenticated user by its cookie and adds user to request object
   * @param {*} req the http request object
   */
  static async getUserFromReq(req) {
    const user = await AuthServices.getUserFromCookie(req)
    if (user.role < 4) user.isAdmin = true
    req.user = user
  }

  static emailValidation(email) {
    const regEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return regEx.test(email)
  }

  /**
   * prepare user for client
   * @param {Object} user Mongoose object - user
   * @returns user for client
   */
  static getUser(user) {
    // TODO: change here to wanted fields;
    return {
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    }
  }
}

export default AuthServices
