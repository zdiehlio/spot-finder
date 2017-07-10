'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  passHash: {type: String, required: true},
  tokenSeed: {type: String, required: true, unique: true},
})

userSchema.methods.createPassHash = function(pass) {
  return bcrypt.hash(pass, 8)
    .then(hash => {
      this.passHash = hash
      return this
    })
}

userSchema.methods.passHashCompare = function(pass) {
  return bcrypt.compare(pass, this.passHash)
    .then(match => {
      if(match) {
        return this
      }
      throw new Error('Password does not match!')
    })
}

userSchema.methods.createTokenSeed = function() {
  return new Promise((resolve, reject) => {
    let attempts = 1
    let firstSeedCreate = () => {
      this.createTokenSeed = crypto.randomBytes(32).toString('hex')
      console.log(this)
      this.save()
        .then(resolve(this))
        .catch(err => {
          if(attempts < 1) {
            return reject(new Error('Could not create token seed'))
          }
          attempts--
          firstSeedCreate()
        })
    }
    firstSeedCreate()
  })
}

userSchema.methods.createToken = function() {
  return this.createTokenSeed()
    .then(() => {
      return jwt.sign({tokenSeed: this.tokenSeed}, process.env.APP_SECRET)
    })
}

const User = module.exports = mongoose.model('user', userSchema)

User.create = function(data) {
  let pass = data.pass
  delete data.pass
  return new User(data).createPassHash(pass)
    .then(user => user.createToken())
}
