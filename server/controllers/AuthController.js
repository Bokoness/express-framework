import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'
import Auth from '../models/AuthModel.js'
import services from '../services/ErrorService.js'
import AuthServices from '../services/AuthServices.js'

class AuthController {
  static COOKIE_EXPIRE_DAYS = process.env.COOKIE_DAYS || 7

  static MS_DAY = 86400000

  /**
   * Register action
   * @param req.body.email user's email
   * @param req.body.password user's password
   * @param req.body.fullname user's fullname
   * @returns 200 status if all went well
   */
  static async register(req, res) {
    try {
      let { email } = req.body
      const { password } = req.body
      if (!email || !password) {
        return services.createError(
          'Register Controller',
          services.errors.auth.badCreds,
          res,
        )
      }
      email = email.toLowerCase()
      email = email.trim()
      if (!AuthServices.emailValidation(email)) {
        return services.createError('Register Controller', services.errors.auth.badCreds, res)
      }
      if (await User.countDocuments({ email })) {
        return services.createError(
          'Register Controller',
          services.errors.auth.emailExists,
          res,
        )
      }
      await User.create({
        email,
        password,
      })
      res.sendStatus(200)
    } catch (e) {
      return services.createError(
        'Register Controller',
        services.errors.generalError,
        res,
      )
    }
  }

  /**
   * Login action
   * @param req.body.email user's email
   * @param req.body.password user's password
   * @returns 200 status if all went well
   */
  static async login(req, res) {
    try {
      let { email } = req.body
      const { password } = req.body
      email = email.toLowerCase()
      email = email.trim()
      const user = await User.findOne({ email })
      if (!user) {
        return services.createError(
          'Login Controller',
          services.errors.auth.badCreds,
          res,
        )
      }
      if (!(await user.checkPass(password))) {
        return services.createError(
          'Login Controller',
          services.errors.auth.badCreds,
          res,
        )
      }
      await Auth.deleteMany({ user })
      const auth = await Auth.create({ user })
      const cookie = jwt.sign({ token: auth.id }, process.env.COOKIES_AUTH)
      res.cookie('user', cookie, {
        maxAge: AuthController.COOKIE_EXPIRE_DAYS * AuthController.MS_DAY,
      })
      return res.send(AuthServices.getUser(user))
    } catch (e) {
      return services.createError(
        'Login Controller',
        services.errors.generalError,
        res,
      )
    }
  }

  /**
   * Logs user out
   * @returns 200 status if all went well
   */
  static async logout(req, res) {
    try {
      await Auth.deleteMany({ user: req.user })
      res.clearCookie('user')
      services.logSuccess('Logout', 'user has logged out')
      res.sendStatus(200)
    } catch (error) {
      return services.createError(
        'AuthController | logout',
        services.errors.generalError,
        res,
      )
    }
  }

  /**
   * Checks if current user is logged in
   * @returns 200 status if all went well
   */
  static async checkLogin(req, res) {
    try {
      console.log('checkLogin found user')
      res.json(AuthServices.getUser(req.user))
    } catch (e) {
      return services.createError(
        'AuthController | login',
        services.errors.auth.notFound,
        res,
      )
    }
  }
}

export default AuthController
