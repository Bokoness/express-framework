import mongoose from 'mongoose'
import passwordHash from 'password-hash'
import userSchema from './schemas/userSchema.js'
import BaseModel from './BaseModel.js'

class UserClass extends BaseModel {
  constructor() {
    super([], [])
  }

  checkPass(pass) {
    return passwordHash.verify(pass, this.password)
  }
}

userSchema.loadClass(UserClass)

const User = mongoose.model('User', userSchema)

export default User
