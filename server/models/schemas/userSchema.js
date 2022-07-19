import mongoose from 'mongoose'
import passwordHash from 'password-hash'
import validators from './customValidators.js'

const { Schema } = mongoose

// Roles
// 0 - Admin
// 1 - Regular user

const DEFAULT_CUSTOMER_ROLE = 1

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: validators.email,
    },
    password: { type: String, validate: validators.password },
    fullName: { type: String },
    role: {
      type: Number,
      default: DEFAULT_CUSTOMER_ROLE,
    },
    phone: { type: String, validate: validators.phoneIsrael },
    team: { type: Schema.Types.ObjectId, ref: 'team' },
  },
  { timestamps: true },
)

// if user changes the password or adding password - hash it
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = passwordHash.generate(user.password)
  }
  next()
})

export default userSchema
