const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter email'],
    validate: [isEmail, 'Please enter a valid email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter password'],
    minlength: [6, 'Password debe tener al menos 6 caracteres'],
  }
})

userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.createJWT = function() {
  return jwt.sign({userId: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

userSchema.methods.comparePWD = async function(candidatePWD) {
    const isMatch = await bcrypt.compare(candidatePWD, this.password)
    return isMatch
}

const User = mongoose.model('user', userSchema)

module.exports = User